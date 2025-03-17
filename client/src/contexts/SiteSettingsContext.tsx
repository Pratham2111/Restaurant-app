import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

// Default translations for all supported languages
const defaultTranslations = {
  en: {
    // Dashboard
    "Restaurant Dashboard": "Restaurant Dashboard",
    "Generate Report": "Generate Report",
    "Table Management": "Table Management",
    "Menu Management": "Menu Management",
    "Site Settings": "Site Settings",
    "Booking Management": "Booking Management",
    "Events Management": "Events Management",
    "Total Orders": "Total Orders",
    "Total Revenue": "Total Revenue",
    "Table Utilization": "Table Utilization",
    "Today's Bookings": "Today's Bookings",
    "Configure language and currency": "Configure language and currency",
    "Manage tables and seating": "Manage tables and seating",
    "Update menu items and categories": "Update menu items and categories",
    "View and manage table reservations": "View and manage table reservations",
    "Manage restaurant events and promotions": "Manage restaurant events and promotions",
    "Orders today": "Orders today",
    "Revenue today": "Revenue today",
    "tables occupied": "tables occupied",
    "Table reservations": "Table reservations",
    // Settings
    "Language & Localization": "Language & Localization",
    "Default Language": "Default Language",
    "Country": "Country",
    "Currency": "Currency",
    "Save Settings": "Save Settings",
    "Saving...": "Saving...",
  },
  fr: {
    // Dashboard
    "Restaurant Dashboard": "Tableau de Bord du Restaurant",
    "Generate Report": "Générer un Rapport",
    "Table Management": "Gestion des Tables",
    "Menu Management": "Gestion du Menu",
    "Site Settings": "Paramètres du Site",
    "Booking Management": "Gestion des Réservations",
    "Events Management": "Gestion des Événements",
    "Total Orders": "Commandes Totales",
    "Total Revenue": "Revenu Total",
    "Table Utilization": "Utilisation des Tables",
    "Today's Bookings": "Réservations du Jour",
    "Configure language and currency": "Configurer la langue et la devise",
    "Manage tables and seating": "Gérer les tables et les places",
    "Update menu items and categories": "Mettre à jour les articles et catégories du menu",
    "View and manage table reservations": "Voir et gérer les réservations de tables",
    "Manage restaurant events and promotions": "Gérer les événements et promotions du restaurant",
    "Orders today": "Commandes aujourd'hui",
    "Revenue today": "Revenu aujourd'hui",
    "tables occupied": "tables occupées",
    "Table reservations": "Réservations de tables",
    // Settings
    "Language & Localization": "Langue et Localisation",
    "Default Language": "Langue par Défaut",
    "Country": "Pays",
    "Currency": "Devise",
    "Save Settings": "Enregistrer les Paramètres",
    "Saving...": "Enregistrement...",
  },
  es: {
    // Dashboard
    "Restaurant Dashboard": "Panel de Control del Restaurante",
    "Generate Report": "Generar Informe",
    "Table Management": "Gestión de Mesas",
    "Menu Management": "Gestión del Menú",
    "Site Settings": "Configuración del Sitio",
    "Booking Management": "Gestión de Reservas",
    "Events Management": "Gestión de Eventos",
    "Total Orders": "Pedidos Totales",
    "Total Revenue": "Ingresos Totales",
    "Table Utilization": "Utilización de Mesas",
    "Today's Bookings": "Reservas de Hoy",
    "Configure language and currency": "Configurar idioma y moneda",
    "Manage tables and seating": "Gestionar mesas y asientos",
    "Update menu items and categories": "Actualizar elementos y categorías del menú",
    "View and manage table reservations": "Ver y gestionar reservas de mesas",
    "Manage restaurant events and promotions": "Gestionar eventos y promociones del restaurante",
    "Orders today": "Pedidos hoy",
    "Revenue today": "Ingresos hoy",
    "tables occupied": "mesas ocupadas",
    "Table reservations": "Reservas de mesa",
    // Settings
    "Language & Localization": "Idioma y Localización",
    "Default Language": "Idioma Predeterminado",
    "Country": "País",
    "Currency": "Moneda",
    "Save Settings": "Guardar Configuración",
    "Saving...": "Guardando...",
  },
  de: {
    // Dashboard
    "Restaurant Dashboard": "Restaurant-Dashboard",
    "Generate Report": "Bericht Erstellen",
    "Table Management": "Tischverwaltung",
    "Menu Management": "Menüverwaltung",
    "Site Settings": "Website-Einstellungen",
    "Booking Management": "Reservierungsverwaltung",
    "Events Management": "Veranstaltungsverwaltung",
    "Total Orders": "Gesamtbestellungen",
    "Total Revenue": "Gesamtumsatz",
    "Table Utilization": "Tischauslastung",
    "Today's Bookings": "Heutige Reservierungen",
    "Configure language and currency": "Sprache und Währung konfigurieren",
    "Manage tables and seating": "Tische und Sitzplätze verwalten",
    "Update menu items and categories": "Menüpunkte und Kategorien aktualisieren",
    "View and manage table reservations": "Tischreservierungen anzeigen und verwalten",
    "Manage restaurant events and promotions": "Restaurant-Events und Promotionen verwalten",
    "Orders today": "Bestellungen heute",
    "Revenue today": "Umsatz heute",
    "tables occupied": "Tische besetzt",
    "Table reservations": "Tischreservierungen",
    // Settings
    "Language & Localization": "Sprache & Lokalisierung",
    "Default Language": "Standardsprache",
    "Country": "Land",
    "Currency": "Währung",
    "Save Settings": "Einstellungen Speichern",
    "Saving...": "Wird gespeichert...",
  }
};

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  translate: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true,
  translate: (key: string) => key,
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const translate = (key: string): string => {
    if (!settings?.language) return key;

    // Try to get translation from database settings first
    const dbTranslations = settings.translations?.[settings.language] || {};
    if (dbTranslations[key]) return dbTranslations[key];

    // Fallback to default translations
    const defaultLangTranslations = defaultTranslations[settings.language as keyof typeof defaultTranslations];
    return defaultLangTranslations?.[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    if (!settings) return `$${amount.toFixed(2)}`;

    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  return (
    <SiteSettingsContext.Provider 
      value={{ 
        settings: settings || null,
        isLoading,
        translate,
        formatCurrency
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}