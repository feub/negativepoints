export interface Theme {
  colors: {
    // Backgrounds
    background: string;
    card: string;
    cardAlt: string;
    input: string;
    overlay: string;

    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Borders
    border: string;

    // Brand colors (stay same in both themes)
    primary: string;
    danger: string;
    primaryLight: string;

    // Special (medals - keep same)
    gold: string;
    silver: string;
    bronze: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#f5f5f5',
    card: '#fff',
    cardAlt: '#f9f9f9',
    input: '#f9f9f9',
    overlay: 'rgba(0, 0, 0, 0.5)',
    text: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#ddd',
    primary: '#007AFF',
    danger: '#FF3B30',
    primaryLight: '#E3F2FD',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#000000',
    card: '#1c1c1e',
    cardAlt: '#2c2c2e',
    input: '#1c1c1e',
    overlay: 'rgba(0, 0, 0, 0.7)',
    text: '#ffffff',
    textSecondary: '#999999',
    textTertiary: '#666666',
    border: '#3a3a3c',
    primary: '#007AFF',
    danger: '#FF3B30',
    primaryLight: 'rgba(0, 122, 255, 0.15)',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
};
