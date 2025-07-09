import * as React from 'react';

export const navigationRef = React.createRef();

let isReadyRef = React.createRef();
let pendingNavigations = [];

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // Queue up navigations for when the container is ready
    console.log('Navigation queued - container not ready yet. Route:', name);
    pendingNavigations.push({ name, params });
  }
}

export function setIsReady() {
  isReadyRef.current = true;
  
  // Execute any pending navigations
  while (pendingNavigations.length > 0) {
    const { name, params } = pendingNavigations.shift();
    if (navigationRef.current) {
      console.log('Executing queued navigation:', name);
      navigationRef.current.navigate(name, params);
    }
  }
}

export function unsetIsReady() {
  isReadyRef.current = false;
  pendingNavigations = []; // Clear any pending navigations
}