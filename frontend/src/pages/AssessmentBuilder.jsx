import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import db from '../utils/db';
import { generateAssessment } from '../utils/seedData';

const QUESTION_TYPES = [
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multiple Choice' },
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'file-upload', label: 'File Upload' }
];

const AssessmentBuilder = () => {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, [jobId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      let assessmentData = await db.assessments.get(jobId);

      // If no assessment exists, create a default one
      if (!assessmentData) {
        const job = await db.jobs.get(jobId);
        if (job) {
          assessmentData = generateAssessment(jobId, job.title);
          await db.assessments.put(assessmentData);
        }
      }

      setAssessment(assessmentData);
    } catch (error) {
      toast.error('Failed to fetch assessment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveAssessment = async () => {
    try {
      await db.assessments.put({ ...assessment, jobId });
      toast.success('Assessment saved successfully');
    } catch (error) {
      toast.error('Failed to save assessment');
    }
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      questions: []
    };
    setAssessment({
      ...assessment,
      sections: [...assessment.sections, newSection]
    });
  };

  const updateSection = (sectionIndex, field, value) => {
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex][field] = value;
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const deleteSection = (sectionIndex) => {
    const updatedSections = assessment.sections.filter((_, idx) => idx !== sectionIndex);
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const addQuestion = (sectionIndex) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type: 'short-text',
      question: 'New Question',
      required: false
    };
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex].questions.push(newQuestion);
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex].questions[questionIndex][field] = value;
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const deleteQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex].questions = updatedSections[sectionIndex].questions.filter(
      (_, idx) => idx !== questionIndex
    );
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const addOption = (sectionIndex, questionIndex) => {
    const updatedSections = [...assessment.sections];
    const question = updatedSections[sectionIndex].questions[questionIndex];
    if (!question.options) question.options = [];
    question.options.push(`Option ${question.options.length + 1}`);
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const updateOption = (sectionIndex, questionIndex, optionIndex, value) => {
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex].questions[questionIndex].options[optionIndex] = value;
    setAssessment({ ...assessment, sections: updatedSections });
  };

  const deleteOption = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = [...assessment.sections];
    updatedSections[sectionIndex].questions[questionIndex].options =
      updatedSections[sectionIndex].questions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
    setAssessment({ ...assessment, sections: updatedSections });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/jobs">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={saveAssessment} className="bg-primary text-primary-foreground hover:bg-accent shadow-md rounded-md px-4 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Save Assessment
          </Button>
        </div>
      </div>

      <div className="rounded-lg shadow-sm p-6" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Assessment Builder</h1>
        <p className="mt-2" style={{ color: 'hsl(var(--muted-foreground))' }}>For: {assessment.jobTitle}</p>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Builder Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sections</h2>
            <Button onClick={addSection} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {assessment.sections.map((section, sectionIdx) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(sectionIdx, 'title', e.target.value)}
                      className="font-semibold text-lg"
                      placeholder="Section Title"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSection(sectionIdx)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.questions.map((question, qIdx) => (
                  <Card key={question.id} className="bg-slate-50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <Label>Question</Label>
                            <Input
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(sectionIdx, qIdx, 'question', e.target.value)
                              }
                              placeholder="Enter question"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteQuestion(sectionIdx, qIdx)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Type</Label>
                            <select
                              value={question.type}
                              onChange={(e) =>
                                updateQuestion(sectionIdx, qIdx, 'type', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            >
                              {QUESTION_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) =>
                                  updateQuestion(sectionIdx, qIdx, 'required', e.target.checked)
                                }
                                className="rounded"
                              />
                              <span className="text-sm">Required</span>
                            </label>
                          </div>
                        </div>

                        {/* Options for choice questions */}
                        {(question.type === 'single-choice' || question.type === 'multi-choice') && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Options</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(sectionIdx, qIdx)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Option
                              </Button>
                            </div>
                            {question.options?.map((option, optIdx) => (
                              <div key={optIdx} className="flex gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(sectionIdx, qIdx, optIdx, e.target.value)
                                  }
                                  placeholder={`Option ${optIdx + 1}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteOption(sectionIdx, qIdx, optIdx)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Numeric constraints */}
                        {question.type === 'numeric' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Min Value</Label>
                              <Input
                                type="number"
                                value={question.min || 0}
                                onChange={(e) =>
                                  updateQuestion(sectionIdx, qIdx, 'min', Number(e.target.value))
                                }
                              />
                            </div>
                            <div>
                              <Label>Max Value</Label>
                              <Input
                                type="number"
                                value={question.max || 100}
                                onChange={(e) =>
                                  updateQuestion(sectionIdx, qIdx, 'max', Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* Text constraints */}
                        {(question.type === 'short-text' || question.type === 'long-text') && (
                          <div>
                            <Label>Max Length</Label>
                            <Input
                              type="number"
                              value={question.maxLength || 500}
                              onChange={(e) =>
                                updateQuestion(sectionIdx, qIdx, 'maxLength', Number(e.target.value))
                              }
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addQuestion(sectionIdx)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold sticky top-0 py-2" style={{ background: 'hsl(var(--accent))', color: 'hsl(var(--primary))' }}>
              Live Preview
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>{assessment.jobTitle} Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment.sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">{section.title}</h3>
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <Label>
                          {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {question.type === 'single-choice' && (
                          <div className="space-y-2">
                            {question.options?.map((option, idx) => (
                              <label key={idx} className="flex items-center gap-2">
                                <input type="radio" name={question.id} />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {question.type === 'multi-choice' && (
                          <div className="space-y-2">
                            {question.options?.map((option, idx) => (
                              <label key={idx} className="flex items-center gap-2">
                                <input type="checkbox" />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {question.type === 'short-text' && (
                          <Input placeholder="Your answer" maxLength={question.maxLength} />
                        )}
                        {question.type === 'long-text' && (
                          <Textarea
                            placeholder="Your answer"
                            maxLength={question.maxLength}
                            rows={4}
                          />
                        )}
                        {question.type === 'numeric' && (
                          <Input
                            type="number"
                            placeholder="Enter number"
                            min={question.min}
                            max={question.max}
                          />
                        )}
                        {question.type === 'file-upload' && (
                          <Input type="file" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilder;
