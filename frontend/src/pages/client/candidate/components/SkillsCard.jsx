import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '../../../../theme/colors';

export default function SkillsCard({
  userSkills,
  allSkills,
  selectedSkillIds,
  accordionOpen,
  onToggleSkill,
  onAddSkills,
  onRemoveSkill,
  onAccordionOpen,
}) {
  const skillCategories = [...new Set(allSkills.map((skill) => skill.category))];

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: colors.shadow.navy,
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: colors.shadow.navyStrong },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: colors.primary.darkest }}
          gutterBottom
        >
          Kỹ năng
        </Typography>

        {userSkills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, color: colors.primary.dark }}
            >
              Kỹ năng của bạn:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {userSkills.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  onDelete={() => onRemoveSkill(skill.id)}
                  sx={{
                    bgcolor: colors.primary.dark,
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-deleteIcon': {
                      color: 'white',
                      '&:hover': { color: colors.accent.main },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Accordion
          expanded={accordionOpen}
          onChange={() => onAccordionOpen(!accordionOpen)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, color: colors.primary.darkest }}>
              Thêm kỹ năng
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%' }}>
              {skillCategories.map((category) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      color: colors.primary.darkest,
                      textTransform: 'capitalize',
                    }}
                  >
                    {category}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      p: 1.5,
                      bgcolor: colors.primary.lighter,
                      borderRadius: 1,
                      border: `1px solid ${colors.primary.light}`,
                    }}
                  >
                    {allSkills
                      .filter(
                        (skill) =>
                          skill.category === category &&
                          !userSkills.some((us) => us.id === skill.id),
                      )
                      .map((skill) => (
                        <Chip
                          key={skill.id}
                          label={skill.name}
                          onClick={() => onToggleSkill(skill.id)}
                          variant={selectedSkillIds.includes(skill.id) ? 'filled' : 'outlined'}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: selectedSkillIds.includes(skill.id) ? 700 : 500,
                            ...(selectedSkillIds.includes(skill.id)
                              ? {
                                  bgcolor: colors.primary.dark,
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: colors.primary.darkest,
                                    boxShadow: colors.shadow.navyMedium,
                                    transform: 'scale(1.05)',
                                  },
                                }
                              : {
                                  borderColor: colors.primary.dark,
                                  color: colors.primary.darkest,
                                  '&:hover': {
                                    borderColor: colors.primary.darkest,
                                    backgroundColor: colors.primary.lighter,
                                    transform: 'scale(1.05)',
                                  },
                                }),
                          }}
                        />
                      ))}
                  </Box>
                </Box>
              ))}

              {allSkills.filter(
                (skill) => !userSkills.some((us) => us.id === skill.id),
              ).length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: '100%', textAlign: 'center', py: 2 }}
                >
                  Tất cả kỹ năng đã được thêm
                </Typography>
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${colors.primary.light}`,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => onAccordionOpen(false)}
                  sx={{
                    borderColor: colors.primary.dark,
                    color: colors.primary.darkest,
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: colors.primary.darkest,
                      backgroundColor: colors.primary.lighter,
                    },
                  }}
                >
                  Huỷ
                </Button>
                <Button
                  variant="contained"
                  onClick={onAddSkills}
                  disabled={selectedSkillIds.length === 0}
                  sx={{
                    background: colors.gradients.primaryButton,
                    color: 'white',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    '&:hover:not(:disabled)': {
                      background: colors.gradients.primaryButtonHover,
                      transform: 'translateY(-2px)',
                      boxShadow: colors.shadow.navyMedium,
                    },
                    '&:disabled': { opacity: 0.6 },
                  }}
                >
                  {selectedSkillIds.length > 0
                    ? `Thêm ${selectedSkillIds.length} kỹ năng`
                    : 'Thêm kỹ năng'}
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
