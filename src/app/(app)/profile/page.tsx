'use client';
import { ProfileForm } from '../profile/profileform';
import React, { useState } from 'react';

import Navbar from '../../../components/Navbar';

export default function SettingsProfilePage() {
  const [user, setUser] = useState(null);
  return (
    <>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-medium">Profile</h3>
          </div>
          <ProfileForm />
        </div>
      </div>
    </>
  );
}
