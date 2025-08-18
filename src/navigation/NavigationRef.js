import * as React from 'react';

export const navigationRef = React.createRef();

let isReadyRef = React.createRef();
let pendingNavigations = [];

export function navigate(name, params) {
  try {
    if (!name || typeof name !== 'string') {
      console.error('Invalid route name provided to navigate:', name);
      return;
    }

    if (isReadyRef.current && navigationRef.current) {
      // Perform navigation if the app has mounted
      try {
        navigationRef.current.navigate(name, params);
        console.log('Navigation executed:', name);
      } catch (navError) {
        console.error('Error during navigation execution:', navError);
      }
    } else {
      // Queue up navigations for when the container is ready
      console.log('Navigation queued - container not ready yet. Route:', name);
      
      // Prevent duplicate queued navigations
      const existingIndex = pendingNavigations.findIndex(nav => nav.name === name);
      if (existingIndex !== -1) {
        // Update existing navigation instead of adding duplicate
        pendingNavigations[existingIndex] = { name, params };
      } else {
        // Limit queue size to prevent memory issues
        if (pendingNavigations.length >= 5) {
          console.warn('Navigation queue full, removing oldest navigation');
          pendingNavigations.shift();
        }
        pendingNavigations.push({ name, params });
      }
    }
  } catch (error) {
    console.error('Error in navigate function:', error);
  }
}

export function setIsReady() {
  try {
    isReadyRef.current = true;
    console.log('Navigation container is ready');
    
    // Execute any pending navigations with error handling
    const pendingCount = pendingNavigations.length;
    if (pendingCount > 0) {
      console.log(`Executing ${pendingCount} queued navigations`);
    }
    
    while (pendingNavigations.length > 0) {
      const navigation = pendingNavigations.shift();
      if (!navigation) continue;
      
      const { name, params } = navigation;
      
      if (navigationRef.current && name) {
        try {
          console.log('Executing queued navigation:', name);
          navigationRef.current.navigate(name, params);
        } catch (execError) {
          console.error('Error executing queued navigation:', execError);
          // Continue with other navigations
        }
      }
    }
  } catch (error) {
    console.error('Error in setIsReady:', error);
    // Clear pending navigations to prevent issues
    pendingNavigations = [];
  }
}

export function unsetIsReady() {
  isReadyRef.current = false;
  pendingNavigations = []; // Clear any pending navigations
}