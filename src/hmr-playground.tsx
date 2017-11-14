import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import DevTools from 'mobx-react-devtools';

import { Redoc } from './components/Redoc/Redoc';
import { AppStore } from './services/AppStore';
import { loadSpec } from './utils/loadSpec';

const renderRoot = (Component: typeof Redoc, props: { store: AppStore }) =>
  render(
    <div>
      <AppContainer>
        <Component {...props} />
      </AppContainer>
    </div>,
    document.getElementById('example'),
  );

const big = window.location.search.indexOf('big') > -1;

const specUrl = big ? 'big-swagger.json' : 'swagger.yaml';

let store;

async function init() {
  const spec = await loadSpec(specUrl);
  store = new AppStore(spec, specUrl);
  renderRoot(Redoc, { store: store });
}

init();

if (module.hot) {
  const reload = (reloadStore = false) => () => {
    if (reloadStore) {
      // create a new Store
      store.dispose();

      const state = store.toJS();
      store = AppStore.fromJS(state);
    }

    renderRoot(Redoc, { store: store });
  };

  module.hot.accept(['./components/Redoc/Redoc'], reload());
  module.hot.accept(['./services/AppStore'], reload(true));
}