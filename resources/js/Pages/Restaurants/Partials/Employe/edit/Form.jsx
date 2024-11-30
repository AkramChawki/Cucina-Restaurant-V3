import { Link, useForm } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState, useRef, useEffect } from 'react';

export default function Form({ employe, restaurants }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const fileInputRefs = {
    profile: useRef(null),
    front: useRef(null),
    back: useRef(null)
  };

  const { data, setData, put, processing, errors } = useForm({
    first_name: employe?.first_name || '',
    last_name: employe?.last_name || '',
    DDN: employe?.DDN || '',
    telephone: employe?.telephone || '',
    address: employe?.address || '',
    city: employe?.city || '',
    country: employe?.country || '',
    marital_status: employe?.marital_status || 'single',
    username: employe?.username || '',
    profile_photo: null,
    id_card_front: null,
    id_card_back: null,
    restau: employe?.restau || '',
    embauche: employe?.embauche || '',
    depart: employe?.depart || '',
  });

  useEffect(() => {
    if (employe?.profile_photo) {
      setPhotoPreview(`https://restaurant.cucinanapoli.com/public/storage/${employe.profile_photo}`);
    }
    if (employe?.id_card_front) {
      setFrontPreview(`https://restaurant.cucinanapoli.com/public/storage/${employe.id_card_front}`);
    }
    if (employe?.id_card_back) {
      setBackPreview(`https://restaurant.cucinanapoli.com/public/storage/${employe.id_card_back}`);
    }
  }, [employe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('employes.update', employe.id), {  // Change post to put here
        preserveScroll: true,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setData(e.target.name, file);

    const reader = new FileReader();
    reader.onload = (e) => {
      switch (type) {
        case 'profile':
          setPhotoPreview(e.target.result);
          break;
        case 'front':
          setFrontPreview(e.target.result);
          break;
        case 'back':
          setBackPreview(e.target.result);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (ref) => {
    fileInputRefs[ref].current?.click();
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl sm:px-6 lg:px-8 px-10 py-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Information Personnel</h3>
                <p className="mt-1 text-sm text-gray-500">Utilisez une adresse permanente où vous pouvez recevoir du courrier.</p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={data.first_name}
                      onChange={e => setData('first_name', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={data.last_name}
                      onChange={e => setData('last_name', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="DDN" className="block text-sm font-medium text-gray-700">
                    Date de Naissance
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="DDN"
                      id="DDN"
                      value={data.DDN}
                      onChange={e => setData('DDN', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.DDN && <div className="text-red-500 text-sm mt-1">{errors.DDN}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Telephone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="telephone"
                      id="telephone"
                      value={data.telephone}
                      onChange={e => setData('telephone', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.telephone && <div className="text-red-500 text-sm mt-1">{errors.telephone}</div>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={data.address}
                      onChange={e => setData('address', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={data.city}
                      onChange={e => setData('city', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Pays
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={data.country}
                      onChange={e => setData('country', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.country && <div className="text-red-500 text-sm mt-1">{errors.country}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                    Situation Familiale
                  </label>
                  <div className="mt-1">
                    <select
                      id="marital_status"
                      name="marital_status"
                      value={data.marital_status}
                      onChange={e => setData('marital_status', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="single">Célibataire</option>
                      <option value="married">Marié(e)</option>
                      <option value="other">Autre</option>
                    </select>
                    {errors.marital_status && <div className="text-red-500 text-sm mt-1">{errors.marital_status}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={data.username}
                      onChange={e => setData('username', e.target.value)}
                      className="flex-1 focus:ring-green-500 focus:border-green-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    />
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      @cucinanapoli.com
                    </span>
                  </div>
                  {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700">
                    restaurant
                  </label>
                  <div className="mt-1">
                    <select
                      id="restau"
                      name="restau"
                      value={data.restau}
                      onChange={e => setData('restau', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.slug}>{restaurant.name}</option>
                        ))}
                    </select>
                    {errors.restau && <div className="text-red-500 text-sm mt-1">{errors.restau}</div>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                  <div className="mt-1 flex items-center">
                    <div
                      onClick={() => triggerFileInput('profile')}
                      className="cursor-pointer"
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <input
                      ref={fileInputRefs.profile}
                      type="file"
                      name="profile_photo"
                      onChange={(e) => handleFileChange(e, 'profile')}
                      className="hidden"
                      accept="image/*"
                    />
                    {errors.profile_photo && <div className="text-red-500 text-sm ml-4">{errors.profile_photo}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">CIN Recto</label>
                  <div
                    onClick={() => triggerFileInput('front')}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-green-500"
                  >
                    <div className="space-y-1 text-center">
                      {frontPreview ? (
                        <img
                          src={frontPreview}
                          alt="ID card front preview"
                          className="mx-auto h-32 w-auto"
                        />
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                              Télécharger un fichier
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRefs.front}
                    type="file"
                    name="id_card_front"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="hidden"
                    accept="image/*"
                  />
                  {errors.id_card_front && <div className="text-red-500 text-sm mt-1">{errors.id_card_front}</div>}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">CIN Verso</label>
                  <div
                    onClick={() => triggerFileInput('back')}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-green-500"
                  >
                    <div className="space-y-1 text-center">
                      {backPreview ? (
                        <img
                          src={backPreview}
                          alt="ID card back preview"
                          className="mx-auto h-32 w-auto"
                        />
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                              Télécharger un fichier
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRefs.back}
                    type="file"
                    name="id_card_back"
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="hidden"
                    accept="image/*"
                  />
                  {errors.id_card_back && <div className="text-red-500 text-sm mt-1">{errors.id_card_back}</div>}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="embauche" className="block text-sm font-medium text-gray-700">
                    Date d'embauche
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="embauche"
                      id="embauche"
                      value={data.embauche}
                      onChange={e => setData('embauche', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.embauche && <div className="text-red-500 text-sm mt-1">{errors.embauche}</div>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="depart" className="block text-sm font-medium text-gray-700">
                    Date de départ
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="depart"
                      id="depart"
                      value={data.depart}
                      onChange={e => setData('depart', e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.depart && <div className="text-red-500 text-sm mt-1">{errors.depart}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end space-x-3">
              <Link
                href={`/edit-employe?restau=${data.restau}`}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {processing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour...
                  </div>
                ) : (
                  'Mettre à jour'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}