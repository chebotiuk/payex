import { Card, Skeleton } from "grommet";
import { Compass } from 'grommet-icons';

import "./SceletFaded.css";

export const SkeletFaded = () => {
  return (
    <Card>
      <div className="skeletonContainer">
        <Skeleton width="medium" height="small" round="xsmall" />
        <Compass className="rotatingIcon" size="large" />
      </div>
    </Card>
  );
}
