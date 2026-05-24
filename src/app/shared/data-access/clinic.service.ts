import {inject, Injectable} from "@angular/core";
import {FIRESTORE, FUNCTIONS, STORAGE} from "../../firebase.providers";
import {httpsCallable} from "firebase/functions";
import {Clinic} from "../interfaces/clinics.interface";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {collection, doc, getDoc, getDocs, query, setDoc, where, documentId, updateDoc, arrayUnion} from "firebase/firestore";
import {UserProfile} from "../interfaces/userProfile";


@Injectable({providedIn: 'root'})
export default class ClinicService {
  private functions = inject(FUNCTIONS);
  private storage = inject(STORAGE);
  private firestore = inject(FIRESTORE);

  async createClinic(dto: Clinic) {
    const callable = httpsCallable<Clinic, { clinicId: string }>(
      this.functions,
      'createNewClinic'
    );

    const cityName = dto.address.city || dto.address.town || dto.address.village;

    // Wzbogacasz DTO o pole ułatwiające wyszukiwanie, zanim wyślesz je do bazy
    if (dto.address) {
      dto.address.searchCity = cityName?.trim();
    }

    const result = await callable(dto);
    await this.addCityToMetadata(cityName);

    return result.data.clinicId;
  }

  async addCityToMetadata(cityName: string): Promise<void> {
    const docRef = doc(this.firestore, 'metadata', 'locations');

    await setDoc(docRef, {
      cities: arrayUnion(cityName.trim())
    }, { merge: true });
  }

  async getClinicsByCity(city: string): Promise<Clinic[]> {
    const clinicsRef = collection(this.firestore, 'clinics');

    // Teraz szukasz zawsze po jednym, pewnym polu pomocniczym
    const q = query(clinicsRef, where('address.searchCity', '==', city));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Clinic[];
  }

  async getAvailableCities(): Promise<string[]> {
    const docRef = doc(this.firestore, 'metadata', 'locations');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data()['cities'] as string[];
    }
    return [];
  }

  async updateCover(file: File, clinic: Clinic) {
    const path = `clinics/${clinic.id}/cover.jpg`
    const reference = ref(this.storage, path);
    const imageUrl = await uploadBytes(reference, file).then(() => getDownloadURL(reference));

    const docReference = doc(this.firestore, 'clinics', clinic.id)

    const updatedClinic = {
      ...clinic,
      coverImage: {
        url: imageUrl,
      },
    };
    await setDoc(docReference, updatedClinic, {merge: true});

    return updatedClinic;
  }


  async getClinicInfo(clinicId: string): Promise<Clinic | null> {
    try {
      const docRef = doc(this.firestore, 'clinics', clinicId)
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;

      return snap.data() as Clinic;
    } catch (e) {
      console.error('[ClinicService] getClinicInfo failed', e);
      return null;
    }
  }

  async getVeterinariesAssignedToClinic(vetIds: string[]): Promise<UserProfile[]> {
    try {
      if (!vetIds.length) return [];
      const chunks: string[][] = [];
      for (let i = 0; i < vetIds.length; i += 10) {
        chunks.push(vetIds.slice(i, i + 10));
      }

      const results = await Promise.all(
        chunks.map(async (chunk) => {

          const q = query(
            collection(this.firestore, 'vets'),
            where(documentId(), 'in', chunk)
          );

          const snapshot = await getDocs(q);

          return snapshot.docs.map(doc =>
            doc.data() as UserProfile
          );
        })
      );

      return results.flat();

    } catch (e) {
      console.error(
        '[ClinicService] getVeterinariesAssignedToClinic failed',
        e
      );

      return [];
    }
  }

  async getAllClinics(): Promise<Clinic[]> {
    const clinicsCollection = collection(this.firestore, 'clinics');
    const snapshot = await getDocs(clinicsCollection);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Clinic[];
  }
}
