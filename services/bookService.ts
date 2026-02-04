// In a real app, this would fetch the chunks.json file.
// For this environment, we will fetch the file from the public directory.

export const fetchChunks = async (): Promise<string[]> => {
  try {
    const response = await fetch('/chunks.json');
    if (!response.ok) {
      throw new Error(`Failed to load book: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chunks:', error);
    // Fallback for development if file is missing
    return Array(365).fill("This is a placeholder for the book content. The actual text would be loaded from chunks.json here.");
  }
};