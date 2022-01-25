import React, {useState} from 'react';
import {Switch} from 'react-native';
// import {useRef} from 'react';

interface Props {
  isOn: boolean;
  onChange: (value: boolean) => void;
}
export const CustomSwitch = ({isOn, onChange}: Props) => {
  const [isEnabled, setIsEnabled] = useState(isOn);
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    onChange(!isEnabled);
  };
  return (
    <Switch
      trackColor={{false: '#767577', true: 'green'}}
      thumbColor={isEnabled ? '#45B649' : '#cb2d3e'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};
