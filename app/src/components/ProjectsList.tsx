import { toPlainText } from '@portabletext/react';
import { getProjects } from '../services/projectData';
import CollectionList, { type CollectionViewProps } from './CollectionList';
import CollectionRow from './CollectionRow';

const ProjectsList = ({ preview = false }: CollectionViewProps) => (
  <CollectionList
    load={getProjects}
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
        returnTo={preview ? undefined : '/projects'}
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
