import React from 'react';
import GitHubButton from 'react-github-btn';

function GitButton() {
  return (
    <>
      <GitHubButton
        href="https://github.com/hung1001"
        data-show-count="true"
        aria-label="Follow @hung1001 on GitHub"
      >
        Follow @hung1001
      </GitHubButton>
      <GitHubButton
        href="https://github.com/hung1001/meme-react/tree/develop"
        data-icon="octicon-star"
        data-show-count="true"
        aria-label="Star hung1001/meme-react on GitHub"
      >
        Star
      </GitHubButton>
      <GitHubButton
        href="https://github.com/hung1001/meme-react/fork"
        data-icon="octicon-repo-forked"
        data-show-count="true"
        aria-label="Fork hung1001/meme-react on GitHub"
      >
        Fork
      </GitHubButton>
    </>
  );
}

export default GitButton;
