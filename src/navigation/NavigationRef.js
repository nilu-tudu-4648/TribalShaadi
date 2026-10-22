import * as React from 'react';

export const navigationRef = React.createRef();

let isReadyRef = React.createRef();
let pendingNavigations = [];

export function navigate(name, params) {
  try {
    if (!name || typeof name !== 'string') {
      return;
    }

    if (isReadyRef.current && navigationRef.current) {
      // Perform navigation if the app has mounted
      try {
        navigationRef.current.navigate(name, params);
      } catch (navError) {
      }
    } else {
      // Queue up navigations for when the container is ready
      
      // Prevent duplicate queued navigations
      const existingIndex = pendingNavigations.findIndex(nav => nav.name === name);
      if (existingIndex !== -1) {
        // Update existing navigation instead of adding duplicate
        pendingNavigations[existingIndex] = { name, params };
      } else {
        // Limit queue size to prevent memory issues
        if (pendingNavigations.length >= 5) {
          pendingNavigations.shift();
        }
        pendingNavigations.push({ name, params });
      }
    }
  } catch (error) {
  }
}

export function setIsReady() {
  try {
    isReadyRef.current = true;
    
    // Execute any pending navigations with error handling
    const pendingCount = pendingNavigations.length;
    if (pendingCount > 0) {
    }
    
    while (pendingNavigations.length > 0) {
      const navigation = pendingNavigations.shift();
      if (!navigation) continue;
      
      const { name, params } = navigation;
      
      if (navigationRef.current && name) {
        try {
          navigationRef.current.navigate(name, params);
        } catch (execError) {
          // Continue with other navigations
        }
      }
    }
  } catch (error) {
    // Clear pending navigations to prevent issues
    pendingNavigations = [];
  }
}

export function unsetIsReady() {
  isReadyRef.current = false;
  pendingNavigations = []; // Clear any pending navigations
}