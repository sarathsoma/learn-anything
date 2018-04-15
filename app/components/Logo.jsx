import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'utils/classNames';
import 'sass/_Logo.sass';

export default ({ big = false, welcome = false }) => {
  const logoClassNames = classNames({
    'la-logo-icon': true,
    'la-logo-icon--big': big,
  });

  return (
    <div className="la-logo-container">
      { welcome ?
        <div className="welcome-bubble">
          <div className="welcome-bubble-text" dangerouslySetInnerHTML={{ __html: __('welcome_text') }} />
          <div className="welcome-bubble-bubble" />
        </div> : ''
      }

      <Link to="/">
        <img className={logoClassNames} src="/resources/icons/logo.svg" alt="logo" />
      </Link>
    </div>
  );
};
