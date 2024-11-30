from storages.backends.azure_storage import AzureStorage

class MediaStorage(AzureStorage):
    account_name = "supermercadopulgar"  # Nombre de tu cuenta de almacenamiento
    account_key = "FK62vb3my8uioGubfvkANvNn8V0VvfSqE6EPBbRh0gnnoIW193ID/1R6CHA7XeFIKxPBFnuzWDBI+ASt7xeOGQ=="  # Llave de acceso
    azure_container = "media"  # Nombre del contenedor
    expiration_secs = None  # URLs permanentes
