import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

const defaultTranslations = {
  en: {
    // Navigation
    "Home": "Home",
    "Menu": "Menu",
    "Book a Table": "Book a Table",
    "Events": "Events",
    "Login": "Login",
    "Register": "Register",
    "My Account": "My Account",
    "Admin Dashboard": "Admin Dashboard",
    "Logout": "Logout",

    // Home Page
    "Welcome to": "Welcome to",
    "Book Your Table": "Book Your Table",
    "View Our Menu": "View Our Menu",
    "About Us": "About Us",
    "Opening Hours": "Opening Hours",
    "Contact Us": "Contact Us",
    "Address": "Address",
    "Phone": "Phone",
    "Email": "Email",

    // Menu Page
    "Our Menu": "Our Menu",
    "Categories": "Categories",
    "Special Dishes": "Special Dishes",
    "Add to Cart": "Add to Cart",
    "Price": "Price",
    "Description": "Description",
    "Ingredients": "Ingredients",
    "Allergens": "Allergens",
    "Preparation Time": "Preparation Time",
    "Serving Size": "Serving Size",

    // Book a Table Page
    "Reservation": "Reservation",
    "Select Date": "Select Date",
    "Select Time": "Select Time",
    "Number of Guests": "Number of Guests",
    "Your Name": "Your Name",
    "Your Email": "Your Email",
    "Your Phone": "Your Phone",
    "Special Requests": "Special Requests",
    "Confirm Booking": "Confirm Booking",
    "Available Tables": "Available Tables",
    "Section": "Section",
    "Seats": "Seats",

    // Events Page
    "Upcoming Events": "Upcoming Events",
    "Past Events": "Past Events",
    "Event Details": "Event Details",
    "Date": "Date",
    "Time": "Time",
    "Location": "Location",
    "Register for Event": "Register for Event",

    // Dashboard Additional
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
    "Weekly Revenue": "Weekly Revenue",
    "Popular Items": "Popular Items",
    "Recent Bookings": "Recent Bookings",
    "Configure language and currency": "Configure language and currency",
    "Manage tables and seating": "Manage tables and seating",
    "Update menu items and categories": "Update menu items and categories",
    "View and manage table reservations": "View and manage table reservations",
    "Manage restaurant events and promotions": "Manage restaurant events and promotions",
    "Orders today": "Orders today",
    "Revenue today": "Revenue today",
    "tables occupied": "tables occupied",
    "Table reservations": "Table reservations",
    "guests": "guests",
    "Table": "Table",

    // Settings
    "Language & Localization": "Language & Localization",
    "Default Language": "Default Language",
    "Country": "Country",
    "Currency": "Currency",
    "Save Settings": "Save Settings",
    "Saving...": "Saving...",

    // Order Management
    "Order Management": "Order Management",
    "Search orders...": "Search orders...",
    "Orders": "Orders",
    "Order ID": "Order ID",
    "Customer": "Customer",
    "Items": "Items",
    "Total": "Total",
    "Status": "Status",
    "Actions": "Actions",
    "Start Preparing": "Start Preparing",
    "Mark Ready": "Mark Ready",
    "Mark Delivered": "Mark Delivered",
    "Status Updated": "Status Updated",
    "Order status has been updated successfully.": "Order status has been updated successfully.",
    "Update Failed": "Update Failed",
    "Failed to update order status. Please try again.": "Failed to update order status. Please try again.",
    "No orders found": "No orders found",
    "pending": "pending",
    "preparing": "preparing",
    "ready": "ready",
    "delivered": "delivered",
    "cancelled": "cancelled",
  },
  fr: {
    // Navigation
    "Home": "Accueil",
    "Menu": "Menu",
    "Book a Table": "Réserver une Table",
    "Events": "Événements",
    "Login": "Connexion",
    "Register": "S'inscrire",
    "My Account": "Mon Compte",
    "Admin Dashboard": "Tableau de Bord Admin",
    "Logout": "Déconnexion",

    // Home Page
    "Welcome to": "Bienvenue à",
    "Book Your Table": "Réservez Votre Table",
    "View Our Menu": "Voir Notre Menu",
    "About Us": "À Propos",
    "Opening Hours": "Heures d'Ouverture",
    "Contact Us": "Contactez-Nous",
    "Address": "Adresse",
    "Phone": "Téléphone",
    "Email": "Email",

    // Menu Page
    "Our Menu": "Notre Menu",
    "Categories": "Catégories",
    "Special Dishes": "Plats Spéciaux",
    "Add to Cart": "Ajouter au Panier",
    "Price": "Prix",
    "Description": "Description",
    "Ingredients": "Ingrédients",
    "Allergens": "Allergènes",
    "Preparation Time": "Temps de Préparation",
    "Serving Size": "Portion",

    // Book a Table Page
    "Reservation": "Réservation",
    "Select Date": "Sélectionner la Date",
    "Select Time": "Sélectionner l'Heure",
    "Number of Guests": "Nombre de Convives",
    "Your Name": "Votre Nom",
    "Your Email": "Votre Email",
    "Your Phone": "Votre Téléphone",
    "Special Requests": "Demandes Spéciales",
    "Confirm Booking": "Confirmer la Réservation",
    "Available Tables": "Tables Disponibles",
    "Section": "Section",
    "Seats": "Places",

    // Events Page
    "Upcoming Events": "Événements à Venir",
    "Past Events": "Événements Passés",
    "Event Details": "Détails de l'Événement",
    "Date": "Date",
    "Time": "Heure",
    "Location": "Lieu",
    "Register for Event": "S'inscrire à l'Événement",

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
    "Weekly Revenue": "Revenu Hebdomadaire",
    "Popular Items": "Articles Populaires",
    "Recent Bookings": "Réservations Récentes",
    "Configure language and currency": "Configurer la langue et la devise",
    "Manage tables and seating": "Gérer les tables et les places",
    "Update menu items and categories": "Mettre à jour les articles et catégories du menu",
    "View and manage table reservations": "Voir et gérer les réservations de tables",
    "Manage restaurant events and promotions": "Gérer les événements et promotions du restaurant",
    "Orders today": "Commandes aujourd'hui",
    "Revenue today": "Revenu aujourd'hui",
    "tables occupied": "tables occupées",
    "Table reservations": "Réservations de tables",
    "guests": "convives",
    "Table": "Table",

    // Settings
    "Language & Localization": "Langue et Localisation",
    "Default Language": "Langue par Défaut",
    "Country": "Pays",
    "Currency": "Devise",
    "Save Settings": "Enregistrer les Paramètres",
    "Saving...": "Enregistrement...",

    // Order Management
    "Order Management": "Gestion des Commandes",
    "Search orders...": "Rechercher des commandes...",
    "Orders": "Commandes",
    "Order ID": "ID de Commande",
    "Customer": "Client",
    "Items": "Articles",
    "Total": "Total",
    "Status": "Statut",
    "Actions": "Actions",
    "Start Preparing": "Commencer la Préparation",
    "Mark Ready": "Marquer Prêt",
    "Mark Delivered": "Marquer Livré",
    "Status Updated": "Statut Mis à Jour",
    "Order status has been updated successfully.": "Le statut de la commande a été mis à jour avec succès.",
    "Update Failed": "Mise à Jour Échouée",
    "Failed to update order status. Please try again.": "Échec de la mise à jour du statut. Veuillez réessayer.",
    "No orders found": "Aucune commande trouvée",
    "pending": "en attente",
    "preparing": "en préparation",
    "ready": "prêt",
    "delivered": "livré",
    "cancelled": "annulé",
  },
  es: {
    // Navigation
    "Home": "Inicio",
    "Menu": "Menú",
    "Book a Table": "Reservar una Mesa",
    "Events": "Eventos",
    "Login": "Iniciar sesión",
    "Register": "Registrarse",
    "My Account": "Mi Cuenta",
    "Admin Dashboard": "Panel de Administración",
    "Logout": "Cerrar sesión",

    // Home Page
    "Welcome to": "Bienvenido a",
    "Book Your Table": "Reserva tu Mesa",
    "View Our Menu": "Ver Nuestro Menú",
    "About Us": "Sobre Nosotros",
    "Opening Hours": "Horario de Apertura",
    "Contact Us": "Contáctanos",
    "Address": "Dirección",
    "Phone": "Teléfono",
    "Email": "Correo electrónico",

    // Menu Page
    "Our Menu": "Nuestro Menú",
    "Categories": "Categorías",
    "Special Dishes": "Platos Especiales",
    "Add to Cart": "Agregar al Carrito",
    "Price": "Precio",
    "Description": "Descripción",
    "Ingredients": "Ingredientes",
    "Allergens": "Alérgenos",
    "Preparation Time": "Tiempo de Preparación",
    "Serving Size": "Tamaño de la Porción",

    // Book a Table Page
    "Reservation": "Reserva",
    "Select Date": "Seleccionar Fecha",
    "Select Time": "Seleccionar Hora",
    "Number of Guests": "Número de Invitados",
    "Your Name": "Tu Nombre",
    "Your Email": "Tu Correo electrónico",
    "Your Phone": "Tu Teléfono",
    "Special Requests": "Solicitudes Especiales",
    "Confirm Booking": "Confirmar Reserva",
    "Available Tables": "Mesas Disponibles",
    "Section": "Sección",
    "Seats": "Asientos",

    // Events Page
    "Upcoming Events": "Próximos Eventos",
    "Past Events": "Eventos Pasados",
    "Event Details": "Detalles del Evento",
    "Date": "Fecha",
    "Time": "Hora",
    "Location": "Ubicación",
    "Register for Event": "Registrarse para el Evento",

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
    "Weekly Revenue": "Ingresos Semanales",
    "Popular Items": "Artículos Populares",
    "Recent Bookings": "Reservas Recientes",
    "Configure language and currency": "Configurar idioma y moneda",
    "Manage tables and seating": "Gestionar mesas y asientos",
    "Update menu items and categories": "Actualizar elementos y categorías del menú",
    "View and manage table reservations": "Ver y gestionar reservas de mesas",
    "Manage restaurant events and promotions": "Gestionar eventos y promociones del restaurante",
    "Orders today": "Pedidos hoy",
    "Revenue today": "Ingresos hoy",
    "tables occupied": "mesas ocupadas",
    "Table reservations": "Reservas de mesa",
    "guests": "invitados",
    "Table": "Mesa",

    // Settings
    "Language & Localization": "Idioma y Localización",
    "Default Language": "Idioma Predeterminado",
    "Country": "País",
    "Currency": "Moneda",
    "Save Settings": "Guardar Configuración",
    "Saving...": "Guardando...",

    // Order Management
    "Order Management": "Gestión de Pedidos",
    "Search orders...": "Buscar pedidos...",
    "Orders": "Pedidos",
    "Order ID": "ID del Pedido",
    "Customer": "Cliente",
    "Items": "Artículos",
    "Total": "Total",
    "Status": "Estado",
    "Actions": "Acciones",
    "Start Preparing": "Comenzar Preparación",
    "Mark Ready": "Marcar Listo",
    "Mark Delivered": "Marcar Entregado",
    "Status Updated": "Estado Actualizado",
    "Order status has been updated successfully.": "El estado del pedido se ha actualizado correctamente.",
    "Update Failed": "Actualización Fallida",
    "Failed to update order status. Please try again.": "Error al actualizar el estado. Inténtelo de nuevo.",
    "No orders found": "No se encontraron pedidos",
    "pending": "pendiente",
    "preparing": "preparando",
    "ready": "listo",
    "delivered": "entregado",
    "cancelled": "cancelado",
  },
  de: {
    // Navigation
    "Home": "Startseite",
    "Menu": "Speisekarte",
    "Book a Table": "Tisch reservieren",
    "Events": "Veranstaltungen",
    "Login": "Anmelden",
    "Register": "Registrieren",
    "My Account": "Mein Konto",
    "Admin Dashboard": "Admin-Dashboard",
    "Logout": "Abmelden",

    // Home Page
    "Welcome to": "Willkommen bei",
    "Book Your Table": "Reservieren Sie Ihren Tisch",
    "View Our Menu": "Sehen Sie unsere Speisekarte",
    "About Us": "Über uns",
    "Opening Hours": "Öffnungszeiten",
    "Contact Us": "Kontaktieren Sie uns",
    "Address": "Adresse",
    "Phone": "Telefon",
    "Email": "E-Mail",

    // Menu Page
    "Our Menu": "Unsere Speisekarte",
    "Categories": "Kategorien",
    "Special Dishes": "Spezielle Gerichte",
    "Add to Cart": "In den Warenkorb legen",
    "Price": "Preis",
    "Description": "Beschreibung",
    "Ingredients": "Zutaten",
    "Allergens": "Allergene",
    "Preparation Time": "Vorbereitungszeit",
    "Serving Size": "Portionsgröße",

    // Book a Table Page
    "Reservation": "Reservierung",
    "Select Date": "Datum auswählen",
    "Select Time": "Uhrzeit auswählen",
    "Number of Guests": "Anzahl der Gäste",
    "Your Name": "Ihr Name",
    "Your Email": "Ihre E-Mail",
    "Your Phone": "Ihre Telefonnummer",
    "Special Requests": "Besondere Wünsche",
    "Confirm Booking": "Reservierung bestätigen",
    "Available Tables": "Verfügbare Tische",
    "Section": "Bereich",
    "Seats": "Plätze",

    // Events Page
    "Upcoming Events": "Kommende Veranstaltungen",
    "Past Events": "Vergangene Veranstaltungen",
    "Event Details": "Veranstaltungsdetails",
    "Date": "Datum",
    "Time": "Uhrzeit",
    "Location": "Ort",
    "Register for Event": "Für Veranstaltung anmelden",

    // Dashboard
    "Restaurant Dashboard": "Restaurant-Dashboard",
    "Generate Report": "Bericht erstellen",
    "Table Management": "Tischverwaltung",
    "Menu Management": "Menüverwaltung",
    "Site Settings": "Website-Einstellungen",
    "Booking Management": "Reservierungsverwaltung",
    "Events Management": "Veranstaltungsverwaltung",
    "Total Orders": "Gesamtbestellungen",
    "Total Revenue": "Gesamtumsatz",
    "Table Utilization": "Tischbelegung",
    "Today's Bookings": "Heutige Reservierungen",
    "Weekly Revenue": "Wochenumsatz",
    "Popular Items": "Beliebte Artikel",
    "Recent Bookings": "Letzte Reservierungen",
    "Configure language and currency": "Sprache und Währung konfigurieren",
    "Manage tables and seating": "Tische und Sitzplätze verwalten",
    "Update menu items and categories": "Menüpunkte und Kategorien aktualisieren",
    "View and manage table reservations": "Tischreservierungen anzeigen und verwalten",
    "Manage restaurant events and promotions": "Restaurant-Events und Aktionen verwalten",
    "Orders today": "Bestellungen heute",
    "Revenue today": "Umsatz heute",
    "tables occupied": "belegte Tische",
    "Table reservations": "Tischreservierungen",
    "guests": "Gäste",
    "Table": "Tisch",

    // Settings
    "Language & Localization": "Sprache & Lokalisierung",
    "Default Language": "Standardsprache",
    "Country": "Land",
    "Currency": "Währung",
    "Save Settings": "Einstellungen speichern",
    "Saving...": "Wird gespeichert...",

    // Order Management
    "Order Management": "Bestellungsverwaltung",
    "Search orders...": "Bestellungen suchen...",
    "Orders": "Bestellungen",
    "Order ID": "Bestellnummer",
    "Customer": "Kunde",
    "Items": "Artikel",
    "Total": "Gesamt",
    "Status": "Status",
    "Actions": "Aktionen",
    "Start Preparing": "Zubereitung Starten",
    "Mark Ready": "Als Fertig Markieren",
    "Mark Delivered": "Als Geliefert Markieren",
    "Status Updated": "Status Aktualisiert",
    "Order status has been updated successfully.": "Bestellstatus wurde erfolgreich aktualisiert.",
    "Update Failed": "Aktualisierung Fehlgeschlagen",
    "Failed to update order status. Please try again.": "Statusaktualisierung fehlgeschlagen. Bitte erneut versuchen.",
    "No orders found": "Keine Bestellungen gefunden",
    "pending": "ausstehend",
    "preparing": "in Zubereitung",
    "ready": "fertig",
    "delivered": "geliefert",
    "cancelled": "storniert",
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