import React, { useState } from 'react';
import styled from 'styled-components';
import IosArrowUp from 'react-ionicons/lib/IosArrowUp';

const ScrollButton = () => {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const Button = styled.button`
    display: ${showScroll ? 'inline-flex' : 'none'};
    background: none;
    border: 1px solid rgba(10, 10, 10, 0.09);
    border-top-left-radius: 40px;
    bottom: 0;
    padding: 0.9rem 1rem 0.5rem 1.3rem;
    position: fixed;
    right: 0;
    transition: all 0.25s ease;
    z-index: 10;

    &:focus {
      outline: 0;
    }

    &:hover {
      background: #f6f6f6;
    }
  `;

  window.addEventListener('scroll', checkScrollTop);

  return (
    <Button title="Back to top" onClick={() => scrollToTop()}>
      <IosArrowUp fontSize="20px" />
    </Button>
  );
};

export default ScrollButton;
