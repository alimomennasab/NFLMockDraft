import React from 'react';
import Prospect from '../components/Prospect';

export default function Page() {
  return (
    <div>
      <Prospect 
        pickNumber={1} 
        prospectName="Luther Burden" 
        position="WR" 
        logoURL="images/mizzou.png" 
      />
      <div></div>
    </div>
  );
}
