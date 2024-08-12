import React from 'react';
import { SignUp as SignUpTemplate } from 'components/templates/SignUp';
import bgImage from 'assets/images/bg-login.webp';

export const SignUpPage: React.FC = () => {
  return (
    <div className='relative flex flex-col w-full min-h-screen overflow-hidden'>
      {/* Background Image */}
      <div
        className='absolute top-0 left-0 w-full h-full bg-center bg-cover z-[-1]'
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* 회원가입 템플릿을 중앙에 배치 */}
      <div className='flex-grow flex items-center justify-center p-4'>
        <SignUpTemplate />
      </div>
    </div>
  );
};
