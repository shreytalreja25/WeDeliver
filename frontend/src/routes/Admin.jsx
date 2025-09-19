import ControlBar from '../components/ControlBar.jsx';
import EventFeed from '../components/EventFeed.jsx';
import Legend from '../components/Legend.jsx';
import MapView from '../components/MapView.jsx';
import RoleSwitch from '../components/RoleSwitch.jsx';
import { useToastContext } from '../lib/ToastContext.jsx';

export default function Admin() {
  const { pushToast } = useToastContext();

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <ControlBar pushToast={pushToast} />
        <RoleSwitch />
        <Legend />
        <EventFeed />
      </div>
      <div className="h-[480px] flex-1 overflow-hidden rounded-xl bg-slate-800 lg:h-full">
        <MapView />
      </div>
    </div>
  );
}
