import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Loading } from '../../../packages/superset-ui-core/src/components/Loading';
import { SupersetClient } from '@superset-ui/core';
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
        const { json } = await SupersetClient.post({
          endpoint: '/api/v1/dashboard/',
          postPayload: {
            dashboard_title: dashboardName,
          },
        });

        const dashboardId = json?.id;

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
