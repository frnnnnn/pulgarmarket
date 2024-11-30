from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

# Configura tus credenciales y contenedor
account_name = 'supermercadopulgar'
account_key = 'FK62vb3my8uioGubfvkANvNn8V0VvfSqE6EPBbRh0gnnoIW193ID/1R6CHA7XeFIKxPBFnuzWDBI+ASt7xeOGQ=='
container_name = 'media'
file_path = './supermercado/Logo.png'
blob_name = 'mjota.jpeg'

# Crear un BlobServiceClient
blob_service_client = BlobServiceClient(account_url=f"https://{account_name}.blob.core.windows.net", credential=account_key)

# Acceder al contenedor y al blob
container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(blob_name)

# Subir la imagen
with open(file_path, 'rb') as file:
    blob_client.upload_blob(file)
    print(f'Imagen subida a: https://{account_name}.blob.core.windows.net/{container_name}/{blob_name}')
