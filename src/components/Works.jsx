/* eslint-disable react-refresh/only-export-components */
import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { ProjectItem } from "./canvas";

const Works = () => {
  const [showAll, setShowAll] = useState(false);
  const featuredNames = ["GEMP", "ABIMS", "Zurpri", "Vespucci"];
  const featuredProjects = featuredNames
    .map((name) => projects.find((project) => project.name === name))
    .filter(Boolean);
  const otherProjects = projects.filter(
    (project) => !featuredNames.includes(project.name)
  );
  const visibleProjects = showAll
    ? [...featuredProjects, ...otherProjects]
    : featuredProjects;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  return (
    <div>
      <motion.div
        variants={{
          initial: {
            x: -100,
            opacity: 0,
          },
          animate: {
            x: 0,
            opacity: 1,
            transition: {
              type: "spring",
              delay: 0.3,
              duration: 0.8,
              stiffness: 100,
              damping: 20,
            },
          },
        }}
        initial="initial"
        animate={controls}
        exit="initial"
      >
        <p className={`${styles.sectionSubText} `}>My works</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div ref={ref} className="w-full flex">
        <motion.p
          variants={{
            initial: {
              x: 100,
              opacity: 0,
            },
            animate: {
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                delay: 0.3,
                duration: 0.8,
                stiffness: 100,
                damping: 20,
              },
            },
          }}
          initial="initial"
          animate={controls}
          exit="initial"
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          A selection of projects showcasing my development and design work.
          Open a card to explore the live project.
        </motion.p>
      </div>

      <div
        className="md:mt-14 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        {visibleProjects.map((project, index) => (
          <motion.div
            variants={{
              initial: {
                x: 100,
                opacity: 0,
                scale: 1,
              },
              hover: {
                scale: 1.02,
              },
              animate: {
                x: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  delay: index * 0.08,
                  duration: 0.5,
                  stiffness: 100,
                  damping: 20,
                },
              },
            }}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            exit="initial"
            whileHover="hover"
            key={project.name}
            className="h-full"
          >
            <ProjectItem
              name={project.name}
              description={project.description}
              role={project.role}
              tools={project.tools}
              image={project.image}
              source_code_link={project.source_code_link}
            />
          </motion.div>
        ))}
      </div>
      {otherProjects.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
            className="rounded-xl bg-tertiary px-6 py-3 text-white font-medium hover:bg-black-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {showAll ? "Show featured projects" : `View all ${projects.length} projects`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Works, "projects");
