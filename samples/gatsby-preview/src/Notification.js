import React from 'react';

const tones = {
  STANDARD: {
    dark: `#663399`
  },
  SUCCESS: {
    dark: `#088413`
  },
  DANGER: {
    dark: `#da0013`
  },
  WARNING: {
    dark: `#fed038`
  }
};

const Notification = ({ tone = `STANDARD`, children, icon: Icon, className }) =>  (
  <div
    className="notification"
    style={{
      borderLeft: `10px solid ${tones[tone].dark}`,
    }}>
    {Icon && <Icon className={className} />}
    {children}
  </div>
)


export default Notification;
