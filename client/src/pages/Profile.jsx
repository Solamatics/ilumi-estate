import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser?.rest?.avatar}
          alt="profile"
          className="my-2 rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-md focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-md focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-md focus:outline-none"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      <div className="flex items-center justify-between mt-4">
        <span className="text-red-700 font-semibold cursor-pointer">Delete Account</span>
        <span className="text-red-700 font-semibold cursor-pointer">Sign out</span>
      </div>

    </div>
  );
};

export default Profile;
