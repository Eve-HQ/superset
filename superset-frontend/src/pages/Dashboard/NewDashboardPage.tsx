import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Loading } from '../../../packages/superset-ui-core/src/components/Loading';
import { setEditMode } from 'src/dashboard/actions/dashboardState';
import { logEvent } from 'src/logger/actions';
import { LOG_ACTIONS_TOGGLE_EDIT_DASHBOARD } from 'src/logger/LogUtils';


export default function NewDashboardPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { editMode } = useSelector(
    (state: any) => ({
      editMode: !!state.dashboardState?.editMode,
    }),
    shallowEqual,
  );

  const boundActionCreators = useMemo(
    () =>
      bindActionCreators(
        {
          setEditMode,
          logEvent,
        },
        dispatch,
      ),
    [dispatch],
  );

  const toggleEditMode = useCallback(() => {
    boundActionCreators.logEvent(LOG_ACTIONS_TOGGLE_EDIT_DASHBOARD, {
      edit_mode: !editMode,
    });
    boundActionCreators.setEditMode(true);
  }, [boundActionCreators, editMode]);



  useEffect(() => {
    const createNewDashboard = async () => {
      try {
        const dashboardName = `New Dashboard ${new Date().toLocaleString()}`;
        const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

        // Get auth token from localStorage
        const token = localStorage.getItem('access_token');

        const response = await fetch(`${apiUrl}/dashboard/create_dashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: dashboardName,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const dashboardId = json?.superset_dashboard_id;

        if (dashboardId) {
          toggleEditMode();
          history.replace(`/analytics/dashboard/${dashboardId}?edit=1`);
        } else {
          console.error('No dashboard ID returned from creation API');
          history.replace('/analytics/dashboard/list');
        }
      } catch (error) {
        console.error('Error creating new dashboard:', error);
        history.replace('/analytics/dashboard/list');
      }
    };

    createNewDashboard();
  }, [history, toggleEditMode]);

  return <Loading />;
}
