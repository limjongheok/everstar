import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModalHeader } from 'components/molecules/ModalHeader/ModalHeader';
import { PrimaryButton } from 'components/atoms/buttons/PrimaryButton';
import { InputField } from 'components/organics/input/InputFields';
import { Select } from 'components/molecules/input/Select';
import { DateInputField } from 'components/organics/input/DateInputField';

export interface SignUpFormProps {
  headerText: string;
  smallButtonText: string;
  showPrimaryButton?: boolean;
  text: string;
  onButtonClick?: (
    phone: string,
    email: string,
    userName: string,
    birthDate: string,
    gender: string,
    questReceptionTime: string, // 추가된 부분
  ) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  headerText,
  smallButtonText,
  showPrimaryButton = true,
  text,
  onButtonClick,
}) => {
  const { userEmail } = useParams<{ userEmail: string }>();

  const [formData, setFormData] = useState({
    name: '',
    birthdate: new Date(),
    gender: '',
    email: userEmail || '',
    phone: '',
    questReceptionTime: '', // 추가된 부분
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, email: userEmail || '' }));
  }, [userEmail]);

  const handleInputChange = (field: keyof typeof formData, value: string | Date | null) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== '' && value !== null,
    );
    setIsButtonDisabled(!allFieldsFilled);
  }, [formData]);

  const handleSubmit = () => {
    if (onButtonClick) {
      onButtonClick(
        formData.phone,
        formData.email,
        formData.name,
        formData.birthdate.toISOString(),
        formData.gender,
        formData.questReceptionTime, // 추가된 부분
      );
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="flex flex-col items-center w-[360px] gap-8 p-5 bg-white rounded-lg shadow-md">
        <ModalHeader text={headerText} showLeftIcon={true} />
        <div className="flex flex-col w-full">
          <div
            className="left-0 text-left [font-family:'Noto_Sans_KR-Medium',Helvetica] font-medium text-[#1f2329] text-2xl tracking-[-2.40px] leading-[normal]"
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
          />
        </div>
        <InputField
          label="이메일"
          showLabel={true}
          showValidationText={false}
          starshow={true}
          state="disable"
          text={formData.email}
          showCheckIcon={false}
          className=""
        />
        <InputField
          label="이름"
          showLabel={true}
          showValidationText={false}
          starshow={true}
          state="default"
          text={formData.name}
          showCheckIcon={false}
          className=""
          onChange={(e) => handleInputChange('name', e.target.value)}
        />

        <DateInputField
          label="생년월일"
          showLabel={true}
          showValidationText={false}
          starshow={true}
          state="default"
          date={formData.birthdate}
          placeholder="생년월일을 선택하세요"
          onChange={(date) => handleInputChange('birthdate', date)}
        />

        <Select
          label="성별"
          className=""
          options={['남성', '여성']}
          title="성별을 선택하세요"
          showLabel={true}
          starshow={true}
          onOptionSelect={(option) => handleInputChange('gender', option as string)}
          infoText=""
          showIcon={true}
        />

        <Select
          label="질문 받을 시간"
          className=""
          options={Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`)}
          title="질문을 받고 싶은 시간을 선택하세요"
          showLabel={true}
          starshow={true}
          onOptionSelect={(option) => handleInputChange('questReceptionTime', option as string)}
          infoText="06시부터 22시까지 가능해요"
          showIcon={true}
        />
        <InputField
          label="전화번호"
          showLabel={true}
          showValidationText={false}
          starshow={true}
          state="default"
          text={formData.phone}
          showCheckIcon={true}
          className=""
          placeholder="전화번호를 입력해 주세요"
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />

        {showPrimaryButton && (
          <div className="flex justify-end w-full">
            <PrimaryButton
              theme="white"
              size="small"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              icon={true}
              hug={true}
            >
              {smallButtonText}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};
