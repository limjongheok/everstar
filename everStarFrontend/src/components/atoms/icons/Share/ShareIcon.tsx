import React from 'react';
import { ReactComponent as ShareIconSVG } from '../../../../assets/icons/share.svg';

interface ShareIconProps {
  size: 16 | 24;
  color?: 'black' | 'gray' | 'white' | 'orange';
}

const ShareIcon: React.FC<ShareIconProps> = ({ size, color = 'black' }) => {
  const sizeClasses = size === 16 ? 'w-4 h-4' : 'w-6 h-6';
  const colorClasses = {
    black: 'text-greyscaleblack-100',
    gray: 'text-greyscaleblack-60',
    white: 'text-greyscalewhite',
    orange: 'text-mainprimary',
  };

  return <ShareIconSVG className={`${sizeClasses} ${colorClasses[color]}`} />;
};

export default ShareIcon;
export type { ShareIconProps };
