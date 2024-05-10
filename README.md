Links

o	Link pagina web: https://proiect-cloud-computing-git-main-alexandra-popas-projects.vercel.app/

o	Link GitHub: https://github.com/alexandra-popa27/Proiect-Cloud-Computing

o	Link Video Youtube: https://youtu.be/jga-H9vOb-I


Introducere

The Cooking Hub este o aplicatie web dedicata gestionarii retetelor, construita cu ajutorul platformelor Vercel, MongoDB si Visual Studio Code. 
Aceasta ofera utilizatorilor o platforma simpla si intuitiva pentru a vizualiza, adauga, actualiza si sterge retete.
Principalele functionalitati ale aplicatiei includ:
o	Vizualizarea Retetelor: Utilizatorii pot explora toate retetele disponibile, fiecare avand detalii precum imagine, nume, tip de bucatarie, dificultate etc.
o	Adaugarea unei Retete Noi: Utilizatorii pot crea retete noi prin completarea unui formular care include informatii precum ingrediente, instructiuni, timp de preparare si gatire, numar de portii, etichete etc.
o	Actualizarea unei Retete: Exista posibilitatea de a actualiza detaliile unei retete existente, inclusiv modificarea sau adaugarea de ingrediente, instructiuni sau alte informatii relevante.
o	Stergerea unei Retete: Utilizatorii pot sterge retetele pe care nu le mai doresc in baza de date.
The Cooking Hub ofera o experienta fluida si placuta, permitand pasionatilor de gatit sa-si organizeze si sa-si gestioneze colectia de retete intr-un mod eficient si simplu. Prin integrarea cu MongoDB, aplicatia asigura o stocare sigura si scalabila a datelor, iar implementarea pe Vercel permite accesul rapid si usor din orice dispozitiv conectat la internet.

Descriere problema
Pentru a indeplini obiectivele stabilite, aplicația The Cooking Hub trebuie sa indeplineasca urmatoarele cerinte:
o	Utilizarea a doua servicii în cloud: Pentru a asigura scalabilitatea si disponibilitatea, aplicatia va utiliza doua servicii in cloud.
o	API REST: Aplicatia va comunica cu serviciile în cloud prin intermediul unui API REST. Acest API va permite operatiuni de citire, scriere, actualizare si stergere a datelor, oferind acces facil la functionalitatile aplicatiei.
o	Gestionarea Rețetelor: Utilizatorii vor putea sa vada, sa adauge, sa modifice si sa stearga retete din colectia lor personala. Aceasta functionalitate va asigura o experienta completa de gestionare a retetelor, permitandu-le utilizatorilor sa isi organizeze eficient colectiile.
o	Interfata Web/Mobile: Aplicatia va fi accesibila atat de pe dispozitive desktop, cat si mobile, oferind o experienta optimizata pentru ambele platforme. Interfata va fi intuitive si usor de utilizat, permitand utilizatorilor sa navigheze si sa interactioneze cu aplicatia fara dificultati.
Implementarea acestor cerinte va oferi o experienta complete si satisfacatoare utilizatorilor, facilitand gestionarea retetelor si indeplinind obiectivele proiectului.

Descriere API
Tehnologii utilizate:

o	MongoDB: Pentru stocarea datelor, aplicatia foloseste o baza de date MongoDB, o baza de date NoSQL scalabila si flexibila ce contine retete de gatit cu diferite atribute.
 
o	Postman: A fost utilizat pentru testarea si debugarea API-ului creat in aplicatie. Postman permite trimiterea de request-uri HTTP si analizarea raspunsurilor pentru a asigura functionalitatea corecta a API-ului.

 
o	Visual Studio Code: A fost mediul principal de dezvoltare, oferind un editor puternic și extensibil pentru cod sursa JavaScript si React, cu suport pentru integrarea cu diverse extensii utile pentru dezvoltarea web.
 
o	Node.js: Backend-ul aplicației este dezvoltat în Node.js, un mediu de execuție JavaScript care permite rularea codului JavaScript pe server. Node.js a fost utilizat pentru a crea serverul API si pentru manipularea datelor din baza de date.
o	Next.js: Framework-ul Next.js a fost utilizat pentru construirea aplicatiei web React. Next.js aduce o serie de avantaje, inclusiv server-side rendering (SSR), static site generation (SSG) si routing simplificat.
o	Tailwind CSS: Stilizarea componentelor aplicației a fost realizata cu ajutorul framework-ului Tailwind CSS, care ofera o abordare de "utility-first" pentru definirea stilurilor CSS.
o	Vercel: Aplicatia este gazduita pe platforma Vercel, care ofera hosting scalabil si gestionarea automata a infrastructurii pentru aplicatii web si a API-uri. Vercel permite, de asemenea, integrarea continua si livrarea continua (CI/CD) pentru a facilita procesul de dezvoltare și implementare.
 
Flux de date
Aplicatia foloseste mai multe metode HTTP pentru a gestiona datele:
GET: Utilizata pentru a obtine datele din aplicatie. În cod, metoda getRecords este folosita pentru a face un request GET catre endpoint-ul /api/records pentru a obtine toate înregistrarile din baza de date.
 
La metoda de mai sus se poate verifica in Postman raspunsul de acest request:  
POST: Folosita pentru a crea o noua inregistrare in baza de date. Functia createRecord face un request POST catre acelasi endpoint /api/records, cu datele noii inregistar
 
La metoda de mai sus se poate verifica in Postman raspunsul de la acest request: 
 
PUT: Utilizata pentru a actualiza o înregistrare existenta. Functia updateRecord face un request PUT catre endpoint-ul /api/records cu datele actualizate ale înregistrarii.
 
La metoda de mai sus se poate verifica in Postman raspunsul de la acest request:
 
DELETE: Folosita pentru a sterge o inregistrare din baza de date. Funcția deleteRecord face un request DELETE catre endpoint-ul /api/records pentru a sterge inregistrarea cu ID-ul specificat.
 
La metoda de mai sus se poate verifica in Postman raspunsul de la acest request:
 
Aceste metode HTTP sunt esentiale pentru crearea, citirea, actualizarea si stergerea datelor (CRUD) în aplicatie. Prin intermediul lor, se interactioneaza cu serverul pentru a efectua diverse operatii asupra resurselor din baza de date.

Folosirea aplicatiei

Pe ecranul principal al aplicatiei regasim numele acesteia, butonul “Found a new recipe? Share it with us!”, precum si toate retetele existente in baza de date expuse sub forma de carduri.
Fiecare card cu reteta contine poza aferenta acesteia, precum si 3 butoane: “Read more”, “Update” si “Delete”.
Pentru a adauga o reteta noua apasam pe butonul “Found a new recipe? Share it with us!” pozitionat deasupra cardurilor. Vom fi redirectionati catre pagina de create care ne permite sa adaugam datele pentru a popula o noua instanta de reteta.
 
In continuare, vom completa campurile sugerate conform sugestiilor oferite in casute.

Butonul “Cancel” se utilizeaza pentru a reveni la pagina principala fara a introduce noua reteta in baza de date.
Butonul “Post recipe” se foloseste de metoda POST si adauga noua inregistrare in baza de date, iar apoi aplicatia revine in pagina principala. In imaginea de mai jos se poate observa ca dupa apasarea acestui buton, reteta a fost adaugata(chenarul rosu).
 
Butonul “Read more” present pe fiecare cartonas de reteta conduce la pagina de view a retetei. Aplicatia se foloseste de metoda getRecordById si metoda GET pentru a extrage din baza de date reteta cu id-ul cautat.
 
Butonul “Go back to the recipe list” intoarce utilizatorul la pagina principala.
Butonul “Update” present pe fiecare cartonas de reteta din pagina principala conduce la pagina de edit a aplicatiei, in care utilizatorul poate actualiza o reteta.
Folosindu-se de metoda PUT, aplicatia modifica obiectul primit si dupa apasarea butonului “Post recipie” aflat la baza acestei pagini, actualizeaza instanta din baza de date.
 
Putem verifica daca “Dinner” a fost adaugat la meal types folosindu-ne de pagina de view.
Prin apasarea butonului “Delete” present pe fiecare cartonas de reteta, reteta este stearsa din baza de date.
Inainte si dupa apasarea pe buton:
 
 
