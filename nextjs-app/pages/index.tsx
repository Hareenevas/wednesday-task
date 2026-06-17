import React from 'react';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Next.js!</h1>
      <p className={styles.description}>
        Get started by editing <code>pages/index.tsx</code>
      </p>
    </div>
  );
};

export default Home;