// Event manager pour synchroniser les mises à jour entre les pages
class BookEventManager {
  constructor() {
    this.listeners = new Map();
  }

  // Abonner une page aux changements
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    // Retourner une fonction de désabonnement
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Émettre un événement
  emit(eventType, data) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Types d'événements
  static EVENTS = {
    BOOK_UPDATED: "book_updated",
    BOOK_DELETED: "book_deleted",
    BOOK_CREATED: "book_created",
    BOOK_STATUS_CHANGED: "book_status_changed",
  };
}

// Instance globale
const bookEventManager = new BookEventManager();

// Ajouter les événements à l'instance pour un accès facile
bookEventManager.EVENTS = BookEventManager.EVENTS;

// Exporter aussi les types d'événements séparément
export const EVENTS = BookEventManager.EVENTS;

export default bookEventManager;
