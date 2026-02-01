import UserProfileForm from './components/AuthForm/userProfileForm.js';
import Chat from "./components/Chat/Chat.js";

function App() {
  return (
    <div className="App">
      {/* <UserProfileForm /> */}
      <Chat roomId="TEST_ROOM_12345" senderId="user1" nickname="Tester" />
    </div>
  );
}

export default App;