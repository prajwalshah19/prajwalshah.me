import { toPlainText } from '@portabletext/react';
import { getProjectSummaries } from '../services/projectData';
import CollectionList, { type CollectionViewProps } from './CollectionList';
import CollectionRow from './CollectionRow';

const ProjectsList = ({ preview = false }: CollectionViewProps) => (
  <CollectionList
    load={getProjectSummaries}
    label="projects"
    allHref="/projects"
    preview={preview}
    renderItem={(project) => (
      <CollectionRow
        key={project._id}
        title={project.name}
        date={project.dates}
        compact={preview}
        href={
          project.slug?.current
            ? `/projects/${project.slug.current}`
            : undefined
        }
        summary={
          project.description?.length > 0
            ? toPlainText(project.description)
            : undefined
        }
      />
    )}
  />
);

export default ProjectsList;
