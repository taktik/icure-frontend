import ckmeans from 'simple-statistics/src/ckmeans';

import {PolymerElement, html} from '@polymer/polymer';
class CkmeansGrouping extends PolymerElement {
  static get template() {
    return html`
		<style>
		</style>
`;
  }

  static get is() {
      return 'ckmeans-grouping';
	}

  static get properties() {
      return {
          maxDistance: {
              type: Number,
              value: 10
          }
      };
	}

  constructor() {
      super();
	}

  cluster(data) {
	    if (!data.length) {
          return { centroids: [], clusters: [] };
      }
      var K = Math.max(Math.round(data.length / 5), 1);
      const history = [];
      var isntStable = true;
      var centroids = null;
      var clusters = null;
      while (isntStable) {
          history.push(K);
          isntStable = false;
          clusters = ckmeans(data, K);
          if (clusters.find(c => !c.length)) {
              isntStable = true;
              K--;
              continue;
          }
          centroids = clusters.map(a => a.reduce((v, s) => s + v, 0) / a.length);
          const positions = centroids.sort((a, b) => a - b);

          for (var i = 0; i < positions.length - 1; i++) {
              var dist = Math.abs(positions[i] - positions[i + 1]);
              if (dist < this.maxDistance) {
                  if (!history.includes(K - 1)) {
                      isntStable = true;
                      K--;
                  }
                  break;
              }
          }
          if (isntStable) {
              continue;
          }
          for (i = 0; i < clusters.length; i++) {
              var maxDistance = clusters[i].reduce((s, v) => Math.max(s, Math.abs(v - centroids[i])), 0);
              if (maxDistance > this.maxDistance) {
                  isntStable = true;
                  K++;
                  break;
              }
          }
      }
      return { centroids: centroids, clusters: clusters };
	}
}

customElements.define(CkmeansGrouping.is, CkmeansGrouping);
