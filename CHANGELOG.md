# Changelog

Sve značajne promene u projektu Aura Fit biće dokumentovane u ovom fajlu.

## [1.3.0] - 2026-03-20

### Dodato (Added)
- **Interni Chat Sistem**: Kompletna real-time komunikacija između trenera i klijenata pomoću Firestore-a.
- **Numerički Bedževi (Badges)**: Prikaz tačnog broja nepročitanih poruka na ikonici chata (ikonica pulsira na desktopu i mobilnom).
- **Brojač Klijenata**: Prikaz trenutnog broja aktivnih klijenata na dugmetu "Clients" u navigaciji za trenere.
- **Moj Trener Prečica**: Kartica na HomeDashboard-u za klijente koja prikazuje broj nepročitanih poruka od trenera.
- **Sekcija za Pomoć**: Novo poglavlje u Help stranici koje objašnjava korišćenje internog dopisivanja.

### Izmenjeno (Changed)
- **Coach Dashboard**: Zamenjeni `mailto:` linkovi direktnom navigacijom ka internom chatu.
- **Lista Klijenata**: Akcija slanja mejla zamenjena internom porukom.
- **Navigacija (Layout)**: Poboljšana mobilna i desktop navigacija sa dinamičkim bedževima.
- **Verzija Sistema**: Projekat zvanično podignut na verziju 1.3.0.

### Ispravljeno (Fixed)
- **Firestore Sorter**: Rešen problem sa nevidljivim porukama uvođenjem ručnog sortiranja (zaobilaženje čekanja na indekse).
- **Sintaksa Dashboarda**: Ispravljena greška u `HomeDashboard.tsx` pri uslovnom renderovanju kartica.
- **Translation Keys**: Popravljen naslov `nav.messages` koji se ranije nije pravilno učitavao.

---

## [1.2.0] - 2026-03-19
### Dodato
- **AI Integracija**: Dodata podrška za automatsko generisanje trening planova i sumiranja podataka klijenata.
- **Search System**: Novi globalni sistem pretrage unutar aplikacije.
- **PWA Prompt**: Poboljšan sistem za instalaciju aplikacije na mobilne uređaje.

---

## [1.1.0] - 2026-03-18
- **UI Redizajn**: Modernizovan profil korisnika i podešavanja.
- **Dark Mode**: Optimizacija boja za noćni režim rada.
