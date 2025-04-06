
import React, { useState } from 'react';
import { skillsMockData, SkillData } from '@/data/skillsData';
import SkillCard from '@/components/skills/SkillCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, Plus } from 'lucide-react';

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillData[]>(skillsMockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });

  const filteredSkills = skills
    .filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(skill => {
      if (filterType === 'available') {
        return skill.interviewers.some(interviewer => interviewer.availability === 'Available');
      }
      return true;
    });

  const handleAddSkill = () => {
    if (newSkill.name.trim() === '') {
      toast.error('Skill name is required');
      return;
    }

    const newSkillData: SkillData = {
      id: `skill-${Date.now()}`,
      name: newSkill.name,
      description: newSkill.description,
      interviewers: []
    };

    setSkills([...skills, newSkillData]);
    setNewSkill({ name: '', description: '' });
    setIsDialogOpen(false);
    toast.success(`Skill "${newSkill.name}" added successfully`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Skills Management</h1>
        <p className="text-muted-foreground">Assign interviewers by skill and manage skill categories</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="available">Available Interviewers</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-1" /> Add New Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input 
                    id="skill-name" 
                    placeholder="e.g., JavaScript"
                    value={newSkill.name}
                    onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skill-description">Description</Label>
                  <Textarea 
                    id="skill-description" 
                    placeholder="Brief description of this skill..."
                    value={newSkill.description}
                    onChange={e => setNewSkill({...newSkill, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No skills found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
