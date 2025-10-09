import { useRef, useCallback } from 'react';

// Rate limiting: Track submissions per email
const submissionTracker = new Map<string, number[]>();
const MAX_SUBMISSIONS_PER_HOUR = 5;

export const useFormDebounce = () => {
  const lastSubmitTime = useRef<number>(0);
  const MIN_SUBMIT_INTERVAL = 3000; // 3 seconds between submissions

  const canSubmit = useCallback((email?: string): { allowed: boolean; message?: string } => {
    const now = Date.now();
    
    // Check debounce (prevent rapid clicks)
    if (now - lastSubmitTime.current < MIN_SUBMIT_INTERVAL) {
      return { 
        allowed: false, 
        message: 'Please wait a moment before submitting again' 
      };
    }

    // Check rate limit per email
    if (email) {
      const submissions = submissionTracker.get(email) || [];
      const oneHourAgo = now - (60 * 60 * 1000);
      
      // Filter out submissions older than 1 hour
      const recentSubmissions = submissions.filter(time => time > oneHourAgo);
      
      if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
        return { 
          allowed: false, 
          message: 'Too many submissions. Please try again later.' 
        };
      }
      
      // Update tracker
      recentSubmissions.push(now);
      submissionTracker.set(email, recentSubmissions);
    }

    lastSubmitTime.current = now;
    return { allowed: true };
  }, []);

  return { canSubmit };
};
