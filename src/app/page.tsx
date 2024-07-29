import React from 'react';
import Prospect from '../components/Prospect';
import Team from '../components/Team';

export default function Page() {
  return (
    <div>
      <Prospect 
        rank={1} 
        prospectName="Luther Burden" 
        position="WR" 
        logoURL="images/mizzou.png" 
      />
      <div></div>
      <Team pickNumber={1} teamName={'Carolina'} logoURL={'images/mizzou.png'}></Team>
    </div>
  );
}
