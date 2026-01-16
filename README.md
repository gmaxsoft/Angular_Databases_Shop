# Database Shop

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/maxsoft/database-shop)
[![Author](https://img.shields.io/badge/author-Maxsoft-green.svg)](https://maxsoft.pl)

Sklep internetowy specjalizujący się w narzędziach i rozwiązaniach bazodanowych. Aplikacja oferuje szeroki wybór produktów związanych z bazami danych, od narzędzi do zarządzania po oprogramowanie analityczne.

## 🚀 Funkcje

### 🛍️ Sklep internetowy
- Przeglądanie produktów i kategorii
- Koszyk zakupowy z pełną funkcjonalnością
- System zamówień i zarządzania kontem użytkownika
- Responsywny design dostosowany do urządzeń mobilnych

### 🌐 Wielojęzyczność (i18n)
- Pełne wsparcie dla języka polskiego i angielskiego
- Łatwe przełączanie języka przez menu w header
- Wszystkie teksty aplikacji są tłumaczone dynamicznie
- Zachowanie wybranego języka między sesjami

### 📱 Technologie
- **Angular 20** - nowoczesny framework do budowania aplikacji webowych
- **Angular Material** - komponenty UI zgodne z Material Design
- **TypeScript** - typowany JavaScript dla lepszej jakości kodu
- **SCSS** - zaawansowane style CSS z zmiennymi i mixinami

## 📦 Instalacja i uruchomienie

### Wymagania wstępne
- Node.js (wersja 18+)
- npm lub yarn
- Angular CLI

### Instalacja zależności
```bash
npm install
```

### Uruchomienie aplikacji
```bash
npm start
```

Aplikacja będzie dostępna pod adresem: `http://localhost:4200`

### Budowanie dla produkcji
```bash
npm run build
```

## 🏗️ Struktura projektu

```
database-shop/
├── src/
│   ├── app/
│   │   ├── components/          # Komponenty współdzielone
│   │   │   ├── cart/           # Koszyk zakupowy
│   │   │   ├── login/          # Formularz logowania
│   │   │   ├── register/       # Formularz rejestracji
│   │   │   ├── user-profile/   # Profil użytkownika
│   │   │   ├── order-details/  # Szczegóły zamówienia
│   │   │   └── ...
│   │   ├── services/           # Usługi aplikacji
│   │   │   ├── translation.service.ts  # Usługa tłumaczeń
│   │   │   ├── cart.service.ts        # Zarządzanie koszykiem
│   │   │   ├── auth.service.ts        # Autentyfikacja
│   │   │   └── ...
│   │   ├── assets/i18n/       # Pliki tłumaczeń
│   │   │   ├── pl.json        # Tłumaczenia polskie
│   │   │   └── en.json        # Tłumaczenia angielskie
│   │   └── ...
├── public/                    # Statyczne zasoby
└── ...
```

## 🌍 Wielojęzyczność

Aplikacja obsługuje dwa języki:
- **Polski** (domyślny)
- **English**

### Dodawanie nowego języka
1. Utwórz plik `xx.json` w folderze `src/assets/i18n/`
2. Dodaj tłumaczenia zgodnie ze strukturą istniejących plików
3. Zaktualizuj `TranslationService` aby obsługiwał nowy język

## 🔧 Konfiguracja

### Routing
Wszystkie ścieżki są zdefiniowane w `app.routes.ts` bez polskich znaków i spacji dla lepszej kompatybilności z URL.

### Metatagi
Dynamiczne metatagi są aktualizowane automatycznie przy zmianie języka i zawartości strony.

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa poprawnie na:
- Komputerach stacjonarnych
- Tabletach
- Smartfonach

## 🤝 Kontakt

**Maxsoft** - [https://maxsoft.pl](https://maxsoft.pl)

Projekt stworzony przez firmę Maxsoft - specjalistów w dziedzinie tworzenia nowoczesnych aplikacji webowych i rozwiązań e-commerce.
