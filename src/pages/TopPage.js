import React, { useContext } from 'react';
import Layout from '../components/templates/Layout/Layout';
import 'firebase/auth';
import Title from '../components/atoms/Title/Title';
import TopSlider from '../components/molecules/TopSlider/TopSlider';
import Button from '../components/atoms/Button/Button';
import { AuthContext } from '../contexts/Auth';

const TopPage = () => {
  const { signin } = useContext(AuthContext);
  return (
    <Layout>
      <Title />
      <TopSlider />
      <Button onClick={signin} imgBtn={true} />
    </Layout>
  );
};

export default TopPage;
