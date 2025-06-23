import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/36520869364/secrets/${secretName}/versions/latest`,
  });

  const payload = version.payload?.data?.toString();
  if (!payload) throw new Error(`Sekret ${secretName} nie zawiera danych`);

  return payload;
}

// import {ProjectsClient} from '@google-cloud/resource-manager';
//
// const projectClient = new ProjectsClient();
// export async function listProjects(): Promise<void> {
//   console.log('Listing GCP projects...');
//
//   const [projects] = await projectClient.searchProjects({});
//
//   // console.log(projects)
//   for (const project of projects) {
//     console.log(`Project ID: ${project.projectId}, Project Name: ${project.name}, Name: ${project.displayName}`);
//   }
// }
