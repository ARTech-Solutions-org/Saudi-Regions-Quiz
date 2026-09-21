import type { SavedJourney } from '../App';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export async function saveJourney(email: string, name: string, journey: SavedJourney) {
  try {
    const response = await fetch(`${API_BASE}/journey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        phone: journey.player?.phone,
        completed: journey.completed,
        answers: journey.answers,
        score: journey.score,
        timeTaken: journey.timeTaken,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save journey');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in saveJourney:', error);
    return null;
  }
}

export async function loadJourney(email: string): Promise<SavedJourney | null> {
  try {
    const response = await fetch(`${API_BASE}/journey/${encodeURIComponent(email)}`);
    if (response.status === 404) return null;
    
    if (!response.ok) {
      throw new Error('Failed to fetch journey');
    }
    
    const { data } = await response.json();
    return {
      completed: data.completed_regions || [],
      answers: data.answers || {},
      score: data.score || 0,
      timeTaken: data.time_taken || 0,
      player: { name: data.name, email: data.email, phone: data.phone },
      currentRegion: null,
      currentQuestion: 0,
    };
  } catch (error) {
    console.error('Error in loadJourney:', error);
    return null;
  }
}
