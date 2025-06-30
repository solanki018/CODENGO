import { Room } from './Room';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import EditorPanel from './components/EditorPanel';
import CollaborativeEditor from './components/editorComps/CollaborativeEditor';

export default function Home() {
  return (
      <Room>
        <div className="flex min-h-screen h-screen bg-black text-white overflow-hidden gap-2 mx-2">
          <Sidebar />
          <EditorPanel />
          {/* <CollaborativeEditor filename="main.ts" /> */}
          <RightPanel />
        </div>
      </Room>
    
  );
}
