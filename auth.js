

  function setLoading(isLoading, loader, btnText, text) {
    if (loader) loader.classList.toggle('show', isLoading);
    if (btnText) btnText.textContent = isLoading ? text : btnText.dataset.default || text;
    const btn = loader?.closest('button');
    if (btn) btn.disabled = isLoading;
  }

  function getFriendlyError(code) {
    const errors = {
      'auth/invalid-email':             'Please enter a valid email address.',
      'auth/user-disabled':             'This account has been disabled.',
      'auth/user-not-found':            'No account found with this email.',
      'auth/wrong-password':            'Incorrect password. Please try again.',
      'auth/email-already-in-use':      'An account with this email already exists.',
      'auth/weak-password':             'Password must be at least 6 characters.',
      'auth/too-many-requests':         'Too many attempts. Please try again later.',
      'auth/network-request-failed':    'Network error. Check your connection.',
      'auth/popup-closed-by-user':      'Sign-in popup was closed. Please try again.',
      'auth/cancelled-popup-request':   'Sign-in was cancelled.',
      'auth/invalid-credential':        'Invalid credentials. Please check and try again.',
    };
    return errors[code] || 'An error occurred. Please try again.';
  }
});