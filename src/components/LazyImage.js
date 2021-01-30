import React, { useState, useEffect } from 'react';
import placeHolder from '../images/placeholder-image.jpg';
import styled from 'styled-components';

const Image = styled.img`
  @keyframes loaded {
    0% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }

  &.loaded:not(.error) {
    animation: loaded 0.3s ease-in-out;
  }

  &.error {
    content: url(${placeHolder});
  }
`;

export const LazyImage = (props) => {
  const { src, alt, className } = props;
  const [imageRef, setImageRef] = useState();
  const [imageSrc, setImageSrc] = useState(placeHolder);

  const onLoad = (event) => {
    event.target.classList.add('loaded');
  };

  const onError = (event) => {
    event.target.classList.add('error');
  };

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          },
        );
        observer.observe(imageRef);
      } else {
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <Image
      className={className}
      src={imageSrc}
      alt={alt}
      ref={setImageRef}
      onLoad={onLoad}
      onError={onError}
    />
  );
};
