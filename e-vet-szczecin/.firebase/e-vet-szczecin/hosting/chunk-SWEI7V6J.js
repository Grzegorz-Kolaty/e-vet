import{a as X,b as K,c as Q}from"./chunk-BVGUGYHM.js";import{i as G}from"./chunk-KDY3UDH4.js";import{$ as E,Aa as J,Ba as Z,C as b,I as M,K as N,L as U,M as _,N as q,O as o,P as n,Q as x,R as d,T as m,U as t,X as S,Y as f,_ as y,aa as w,b as u,ba as C,da as v,ea as V,g,ga as P,j as p,l as z,la as W,m as L,ta as I,u as R,ua as O,v as i,va as T,wa as j,xa as B,y as D,ya as F}from"./chunk-H22KX6EP.js";import"./chunk-ECBXVGWK.js";var k=class e{storage=p(J);getStorageReference(l){return j(this.storage,l)}uploadFileResult(l){let c=this.getStorageReference(l.path),s=O(c,l.file).then(()=>T(c));return u(s)}getUrl(l){return u(T(l))}static \u0275fac=function(c){return new(c||e)};static \u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"})};var A=class e{functions=p(Z);setRoleClaims(l,c){let s=B(this.functions.app),a=F(s,"setCustomClaims");return u(a({idToken:l,role:c}))}onRoleSelected(){let l=B(this.functions.app),c=F(l,"onRoleSelect");return u(c())}static \u0275fac=function(c){return new(c||e)};static \u0275prov=g({token:e,factory:e.\u0275fac,providedIn:"root"})};var $={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]};var c2={prefix:"fas",iconName:"camera-retro",icon:[512,512,[128247],"f083","M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"]};var l2={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]};var s2={prefix:"fas",iconName:"shield-cat",icon:[512,512,[],"e572","M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM160 154.4c0-5.8 4.7-10.4 10.4-10.4l.2 0c3.4 0 6.5 1.6 8.5 4.3l40 53.3c3 4 7.8 6.4 12.8 6.4l48 0c5 0 9.8-2.4 12.8-6.4l40-53.3c2-2.7 5.2-4.3 8.5-4.3l.2 0c5.8 0 10.4 4.7 10.4 10.4L352 272c0 53-43 96-96 96s-96-43-96-96l0-117.6zM216 288a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm96-16a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"]};var a2={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"]};var e2=()=>[1,2,3,4],o2=(e,l)=>({finished:e,active:l}),n2=()=>["fas","user"];function i2(e,l){if(e&1&&(o(0,"div",6),x(1,"fa-icon",9),n()),e&2){let c=l.$implicit,s=t(2),a=C(2);M("ngClass",V(2,o2,c<a,c===a)),i(),M("icon",s.stepIcons[c-1])}}function f2(e,l){if(e&1){let c=d();o(0,"h4",10),f(1,"Wprowad\u017A kod weryfikacyjny"),n(),o(2,"h5",11),f(3),n(),x(4,"input",12,0),o(6,"button",13),m("click",function(){z(c);let a=S(5),r=t(2);return L(r.verifyEmailCode(a.value))}),f(7," Zweryfikuj kod "),n(),o(8,"button",14),m("click",function(){z(c);let a=t(2),r=C(0);return L(a.sendEmailVerification(r))}),f(9," Wy\u015Blij ponownie "),n()}if(e&2){let c=t(2),s=C(0);i(3),y("Na adres mailowy ",s.email," zosta\u0142 wys\u0142any mail z kodem autoryzuj\u0105cym. "),i(3),M("disabled",c.userEmailVerified()||c.isLoading()),i(2),M("disabled",c.userEmailVerified()||c.isLoading())}}function r2(e,l){if(e&1){let c=d();o(0,"h4",15),f(1,"Wybierz rol\u0119"),n(),o(2,"button",16),m("click",function(){z(c);let a=t(2),r=C(1);return L(a.updateUserRole(a.Role.User,r))}),f(3," U\u017Cytkownik "),n(),o(4,"button",16),m("click",function(){z(c);let a=t(2),r=C(1);return L(a.updateUserRole(a.Role.Vet,r))}),f(5," Weterynarz "),n()}if(e&2){let c=t(2);i(2),M("disabled",!!c.userRole()||c.isLoading()),i(2),M("disabled",!!c.userRole()||c.isLoading())}}function t2(e,l){if(e&1){let c=d();o(0,"div",10)(1,"label",17),f(2," Nazwa u\u017Cytkownika "),n(),o(3,"div",18),x(4,"input",19,1),o(6,"button",20),m("click",function(){z(c);let a=S(5),r=t(2),h=C(0);return L(r.updateAuthDisplayName(a.value,h))}),f(7),n()()(),o(8,"div",10)(9,"label",21),f(10,"Email"),n(),x(11,"input",22),n()}if(e&2){let c=t(2),s=C(0);i(4),M("value",s.displayName),i(2),M("disabled",s.displayName||c.isLoading()),i(),y(" ",s.displayName?"Confirmed":"Confirm"," "),i(4),M("value",s.email)}}function z2(e,l){if(e&1){let c=d();o(0,"section",3)(1,"div",5),_(2,i2,2,5,"div",6,U),o(4,"button",7),m("click",function(){z(c);let a=t();return L(a.currentStep.set(1))}),f(5," Krok 1 "),n(),o(6,"button",7),m("click",function(){z(c);let a=t();return L(a.currentStep.set(2))}),f(7," Krok 2 "),n(),o(8,"button",7),m("click",function(){z(c);let a=t();return L(a.currentStep.set(3))}),f(9," Krok 3 "),n(),o(10,"button",7),m("click",function(){z(c);let a=t();return L(a.currentStep.set(4))}),f(11," Krok 4 "),n(),o(12,"h6"),f(13,"Rejestracja konta"),n(),o(14,"h6"),f(15,"Weryfikacja e-mail"),n(),o(16,"h6"),f(17,"Rola"),n(),o(18,"h6"),f(19,"Profil"),n()(),o(20,"div",8),b(21,f2,10,3)(22,r2,6,2)(23,t2,12,4),n()()}if(e&2){let c=t(),s=C(1);i(2),q(v(3,e2)),i(19),N(c.currentStep()===2?21:-1),i(),N(c.currentStep()===3&&s?22:-1),i(),N(c.currentStep()===4?23:-1)}}function L2(e,l){if(e&1){let c=d();o(0,"input",23,2),m("change",function(a){z(c);let r=t(2),h=C(0);return L(r.handleFileSelection(a,h))}),n(),o(2,"div",24)(3,"div",25),x(4,"img",26),o(5,"button",27),m("click",function(){z(c);let a=S(1);return L(a.click())}),x(6,"fa-icon",28),n()()()}if(e&2){t(2);let c=C(0);i(4),M("src",c.photoURL||"assets/placeholder.svg",R),i(2),M("icon",v(2,n2))}}function m2(e,l){if(e&1&&b(0,L2,7,3),e&2){t();let c=C(0);N(c?0:-1)}}var H=class e{authService=p(I);storageService=p(k);functionsService=p(A);stepIcons=[a2,l2,s2,$,c2];Role=Q;user=this.authService.user;userEmailVerified=this.authService.isEmailVerified;userToken=this.authService.userToken;userRole=this.authService.userRole;userName=this.authService.userDisplayName;userPhoto=this.authService.userPhoto;userProfileCompleted=this.authService.isProfileCompleted;isLoading=P(()=>!1);currentStep=P(()=>{let l=this.user(),c=this.userEmailVerified(),s=this.userToken(),a=this.userRole(),r=this.userProfileCompleted(),h=this.userName();if(r&&h)return 5;if(r)return 4;if(c&&s&&!a)return 3;if(l&&!c)return console.log(l,c),2;if(l)return 1;this.authService.logout()});handleFileSelection(l,c){let a=l.target.files;if(a){let r={file:a[0],path:`users/${c.uid}/profilePic.jpg`};this.updateStoragePhotoUrl(r,c)}}updateStoragePhotoUrl(l,c){this.isLoading.set(!0),this.storageService.uploadFileResult(l).subscribe({next:s=>this.updateAuthPhotoUrl(s,c),error:s=>console.error(s),complete:()=>{console.log("storagePhoto updated"),this.isLoading.set(!1)}})}updateAuthPhotoUrl(l,c){this.isLoading.set(!0),this.authService.updateProfileData({photoURL:l},c).subscribe({next:()=>this.userPhoto.set(l),error:s=>console.error(s),complete:()=>{this.isLoading.set(!1),console.log("authProfile photoUrl updated")}})}updateAuthDisplayName(l,c){this.isLoading.set(!0),this.authService.updateProfileData({displayName:l},c).subscribe({next:()=>{this.authService.userDisplayName.set(l)},error:s=>console.error(s),complete:()=>{this.isLoading.set(!1),console.log("authProfile name updated")}})}sendEmailVerification(l){this.isLoading.set(!0),this.authService.initiateEmail(l).subscribe({next:()=>{console.log("email sent")},error:c=>{console.error(c)},complete:()=>{this.isLoading.set(!1),console.log("stream completed")}})}verifyEmailCode(l){this.isLoading.set(!0),this.authService.applyEmailVerificationCode(l).subscribe({next:()=>{console.log("email verified"),this.authService.isEmailVerified.set(!0)},error:c=>{console.error(c),this.isLoading.set(!1)},complete:()=>{this.isLoading.set(!1),console.log("stream completed")}})}updateUserRole(l,c){this.isLoading.set(!0),this.functionsService.setRoleClaims(c,l).subscribe({next:()=>{console.log("update role succsess"),this.authService.userRole.set(l)},error:s=>{console.error(s)},complete:()=>{this.isLoading.set(!1),console.log("stream completed")}})}selectRole(){this.functionsService.onRoleSelected().subscribe({next:l=>{console.log(l)},error:l=>{console.error(l)},complete:()=>{console.log("stream completed")}})}static \u0275fac=function(c){return new(c||e)};static \u0275cmp=D({type:e,selectors:[["app-profile"]],decls:7,vars:4,consts:[["codeInput",""],["userPhotoUrlInput",""],["inputField",""],[1,"container"],["type","button",1,"btn","btn-outline-secondary",3,"click"],[1,"grid-steps","m-5","text-center"],[1,"step-bar",3,"ngClass"],["type","button","disabled","",1,"btn","btn-link","p-0","text-decoration-none",3,"click"],[1,"bg-white","shadow","rounded-3","p-5","w-50","mx-auto"],[1,"step-icon",3,"icon"],[1,"mb-3"],[1,"mb-4"],["type","text","placeholder","Kod weryfikacyjny",1,"form-control","mb-3"],["type","button",1,"btn","btn-primary","w-100","mb-3",3,"click","disabled"],["type","button",1,"text-primary","bg-transparent","border-0",3,"click","disabled"],[1,"text-center","px-2"],["type","button",1,"btn","btn-outline-secondary",3,"click","disabled"],["for","userPhotoUrlInput",1,"form-label"],[1,"input-group"],["type","text","id","userPhotoUrlInput","placeholder","name","aria-label","username","aria-describedby","userPhotoUrlInput",1,"form-control",3,"value"],["type","button","id","userPhotoUrlInput",1,"btn","btn-outline-secondary",3,"click","disabled"],["for","emailInput",1,"form-label"],["type","email","id","emailInput","placeholder","email","disabled","",1,"form-control",3,"value"],["hidden","","type","file","id","file","accept","image/png, image/jpeg",3,"change"],[1,"p-5","profile-sidebar","position-relative","mb-5"],[1,"position-absolute","top-100","start-50","translate-middle"],["width","126","alt","profile",1,"border","border-5","border-white","rounded-circle","img-fluid","position-relative",3,"src"],["type","button",1,"btn","btn-sm","btn-outline-secondary","border-0","position-absolute","bottom-0","end-0",3,"click"],[3,"icon"]],template:function(c,s){if(c&1){let a=d();E(0)(1)(2),b(3,z2,24,4,"section",3)(4,m2,1,1),o(5,"button",4),m("click",function(){return z(a),L(s.selectRole())}),f(6,"Button do call function"),n()}if(c&2){let a=w(s.user());i(),w(s.userToken()),i();let r=w(s.currentStep());i(),N(r&&a&&s.currentStep()!==5?3:4)}},dependencies:[G,K,X,W],styles:[".grid-steps[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:3rem;align-items:center;font-size:1.5rem}.step-bar[_ngcontent-%COMP%]{display:flex;justify-content:center;position:relative;height:2px;background-color:#e9ecef;transition:background-color .3s ease}.step-bar.finished[_ngcontent-%COMP%]{background-color:#2ecc71a8}.step-bar.active[_ngcontent-%COMP%]{background-color:#4361eec2}.step-bar.active[_ngcontent-%COMP%]   .step-icon[_ngcontent-%COMP%]{background-color:#4361ee;box-shadow:0 0 0 5px #4361ee33}.step-icon[_ngcontent-%COMP%]{position:absolute;width:3rem;display:flex;justify-content:center;align-items:center;color:#fff;font-weight:700;border-radius:50%;background-color:#e9ecef;aspect-ratio:1/1;transform:translateY(-50%)!important}.step-bar.finished[_ngcontent-%COMP%]   .step-icon[_ngcontent-%COMP%]{background-color:#2ecc71}.profile-sidebar[_ngcontent-%COMP%]{background:linear-gradient(135deg,#4158d0,#c850c0)}.img-fluid[_ngcontent-%COMP%]{height:128px}"],changeDetection:0})};export{H as default};
