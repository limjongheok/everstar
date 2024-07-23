import React from 'react';
import { ReactComponent as Rocket } from '../../../../assets/symbols/rocket.svg';


interface RocketIconsProps {
  variant: 'rocket' | 'rocket-text';
  text?: string;
}

const RocketIcons: React.FC<RocketIconsProps> = ({ variant, text }) => {

  return (
    <div style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}>
      {variant === 'rocket-text' ? (
        <div style={{
          position: 'relative',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Noto_Sans-Bold',Helvetica",
          fontWeight: 'bold',
          fontSize: '8px',
          color: 'black',
          lineHeight: '8px',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}>
          {text || '영원별탐사'}
        </div>
      ) : (
        <Rocket className='w-6 h-6'/> 
  )}
    </div>
  );
};

export default RocketIcons;
export type { RocketIconsProps };
