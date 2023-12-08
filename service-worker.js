const CACHE_NAME = 'shop_local_ease-cache-v1';
const CACHE_LIST = ['shop_local_ease-cache-v1', 'home-page-cache-v1', 'products-cache-v1']
const urlsToCache = [
  '/',
  '/css/main.css'
];

//Configurações inicial - Primeiro evento a ser chamado após o registro do service-worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


//Após a instalação, o activate é chamado, aqui devemos limpar os dados antigos ou atualizá-los
self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_LIST.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
});

//Qualquer chamada a rede, é interceptada por este ouvinte.
//Aqui se verifica se faz-se necessário a chamada ou o recurso já se encontra no cache
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
  
          let fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            response => {
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              let responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      
      );
  });
