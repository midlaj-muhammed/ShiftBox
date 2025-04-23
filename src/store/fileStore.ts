
import { FileItem } from "@/types";

// A simple in-memory store for shared files
// In a real app, this would be replaced with a database
const fileStore = {
  // This Map will hold all the shared files, with fileId as the key
  sharedFiles: new Map<string, FileItem>(),

  // Add a file to the store
  addFile(file: FileItem) {
    this.sharedFiles.set(file.id, file);
    
    // Also save to localStorage for persistence between page reloads
    const allFiles = this.getAllFiles();
    allFiles.push(file);
    localStorage.setItem('sharedFiles', JSON.stringify(allFiles));
  },

  // Get a file by its ID
  getFile(fileId: string): FileItem | undefined {
    // First check in-memory map
    if (this.sharedFiles.has(fileId)) {
      return this.sharedFiles.get(fileId);
    }
    
    // If not found in memory, try localStorage
    const allFiles = this.getAllFiles();
    const file = allFiles.find(file => file.id === fileId);
    
    // If found in localStorage, add to in-memory map for faster access next time
    if (file) {
      this.sharedFiles.set(fileId, file);
    }
    
    return file;
  },

  // Get all files from localStorage
  getAllFiles(): FileItem[] {
    const storedFiles = localStorage.getItem('sharedFiles');
    if (storedFiles) {
      return JSON.parse(storedFiles);
    }
    return [];
  },

  // Initialize the store from localStorage
  init() {
    const allFiles = this.getAllFiles();
    allFiles.forEach(file => {
      this.sharedFiles.set(file.id, file);
    });
  }
};

// Initialize the store
fileStore.init();

export default fileStore;
