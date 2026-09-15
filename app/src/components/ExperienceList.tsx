import { PortableText, toPlainText } from '@portabletext/react';
import { getExperiences } from '../services/experienceData';
import CollectionList, { type CollectionViewProps } from './CollectionList';
import CollectionRow from './CollectionRow';

const ExperienceList = ({ preview = false }: CollectionViewProps) => (
  <CollectionList
    load={getExperiences}
    label="experience"
    allHref="/experience"
    preview={preview}
    renderItem={(experience) => (
      <CollectionRow
        key={experience._id}
        title={experience.company}
        date={experience.dateRange}
        subtitle={experience.position}
        location={experience.location}
        compact={preview}
        summary={
          experience.description?.length > 0 &&
          (preview ? (
            toPlainText(experience.description)
          ) : (
            <PortableText value={experience.description} />
          ))
        }
      />
    )}
  />
);

export default ExperienceList;
