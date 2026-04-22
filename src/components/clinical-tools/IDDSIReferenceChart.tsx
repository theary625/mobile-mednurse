import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Droplets, UtensilsCrossed, TestTube, AlertTriangle } from 'lucide-react';

interface IDDSILevel {
  level: number;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  description: string;
  characteristics: string[];
  testingMethod: string;
  examples: string[];
  type: 'drink' | 'food' | 'transitional';
}

const iddsiLevels: IDDSILevel[] = [
  {
    level: 0,
    name: 'Thin',
    color: '#FFFFFF',
    bgClass: 'bg-white',
    borderClass: 'border-gray-300',
    description: 'Flows like water',
    characteristics: [
      'Flows like water',
      'Fast flow through syringe/prongs',
      'Can drink through any teat, cup, straw',
    ],
    testingMethod: 'IDDSI Flow Test: All liquid flows through 10ml syringe in ≤10 seconds',
    examples: ['Water', 'Tea', 'Coffee', 'Clear juices', 'Soft drinks', 'Milk'],
    type: 'drink',
  },
  {
    level: 1,
    name: 'Slightly Thick',
    color: '#D4D4D4',
    bgClass: 'bg-gray-200',
    borderClass: 'border-gray-400',
    description: 'Thicker than water, flows through straw',
    characteristics: [
      'Thicker than water',
      'Requires a little more effort to drink',
      'Flows through straw',
    ],
    testingMethod: 'IDDSI Flow Test: 1-4ml remains in syringe after 10 seconds',
    examples: ['Anti-reflux infant formula', 'Some commercial thickened drinks'],
    type: 'drink',
  },
  {
    level: 2,
    name: 'Mildly Thick',
    color: '#FFB6C1',
    bgClass: 'bg-pink-200',
    borderClass: 'border-pink-400',
    description: 'Flows off spoon, sippable',
    characteristics: [
      'Flows off a spoon',
      'Sippable from a cup',
      'Some effort to drink through standard straw',
    ],
    testingMethod: 'IDDSI Flow Test: 4-8ml remains in syringe after 10 seconds',
    examples: ['Thickened juice (nectar consistency)', 'Some yogurt drinks', 'Cream soups'],
    type: 'drink',
  },
  {
    level: 3,
    name: 'Moderately Thick / Liquidised',
    color: '#FFD700',
    bgClass: 'bg-yellow-300',
    borderClass: 'border-yellow-500',
    description: 'Can be drunk from cup or eaten with spoon',
    characteristics: [
      'Smooth texture, no lumps',
      'Cannot be drunk from a cup',
      'Cannot be sucked through straw',
      'Drips slowly in dollops through fork prongs',
    ],
    testingMethod: 'IDDSI Flow Test: 8+ml remains in syringe after 10 seconds. Fork Drip Test: Drips slowly through prongs',
    examples: ['Thick smoothie', 'Blended soup (no lumps)', 'Yogurt', 'Tomato sauce consistency'],
    type: 'transitional',
  },
  {
    level: 4,
    name: 'Extremely Thick / Pureed',
    color: '#FF8C00',
    bgClass: 'bg-orange-400',
    borderClass: 'border-orange-600',
    description: 'Usually eaten with spoon, does not require chewing',
    characteristics: [
      'No lumps',
      'Not sticky',
      'Does not require chewing',
      'Falls off spoon in a single spoonful when tilted',
      'Holds its shape on a plate',
    ],
    testingMethod: 'Fork Drip Test: Sits above fork, does not drip through prongs. Spoon Tilt Test: Falls off in a single spoonful',
    examples: ['Pureed fruit/vegetables', 'Smooth mashed potato', 'Mousse', 'Smooth pudding'],
    type: 'transitional',
  },
  {
    level: 5,
    name: 'Minced & Moist',
    color: '#FF4500',
    bgClass: 'bg-orange-600 text-white',
    borderClass: 'border-orange-700',
    description: 'Small lumps, minimal chewing required',
    characteristics: [
      'Small lumps visible',
      'Lumps easily squashed with tongue',
      '4mm particle size (adult) / 2mm (pediatric)',
      'Moist with some thick sauce',
      'Minimal chewing required',
    ],
    testingMethod: 'Fork Pressure Test: Lumps can be mashed with minimal pressure. Spoon Tilt Test: Moist enough to fall off spoon',
    examples: ['Finely minced meat with gravy', 'Flaked fish with sauce', 'Minced vegetables', 'Soft scrambled eggs'],
    type: 'food',
  },
  {
    level: 6,
    name: 'Soft & Bite-Sized',
    color: '#228B22',
    bgClass: 'bg-green-600 text-white',
    borderClass: 'border-green-700',
    description: 'Soft texture, can be mashed with fork',
    characteristics: [
      'Soft and moist throughout',
      'Bite-sized pieces: 1.5cm (adult) / 8mm (pediatric)',
      'Can be mashed with fork',
      'Chewing required before swallowing',
      'No hard/crunchy/chewy pieces',
    ],
    testingMethod: 'Fork Pressure Test: Can be cut and mashed with edge of fork',
    examples: ['Soft cooked vegetables', 'Tender meat (no gristle)', 'Soft fruits', 'Moist cake without nuts'],
    type: 'food',
  },
  {
    level: 7,
    name: 'Regular / Easy to Chew',
    color: '#000000',
    bgClass: 'bg-gray-900 text-white',
    borderClass: 'border-gray-900',
    description: 'Normal everyday foods (or soft without size restriction)',
    characteristics: [
      'Normal everyday foods of various textures',
      'Any method of cooking',
      'Easy to Chew: Soft, tender foods, no size restriction',
      'Ability to bite & chew required',
    ],
    testingMethod: 'No specific test - normal food textures',
    examples: ['Regular diet', 'Sandwiches', 'Salads', 'Meat', 'Raw fruits/vegetables'],
    type: 'food',
  },
];

const drinkLevels = iddsiLevels.filter(l => l.type === 'drink' || l.type === 'transitional');
const foodLevels = iddsiLevels.filter(l => l.type === 'food' || l.type === 'transitional');

const IDDSIReferenceChart: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<IDDSILevel | null>(null);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">IDDSI Framework Reference</CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          International Dysphagia Diet Standardisation Initiative - Texture & Thickness Levels
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>About IDDSI:</strong> A global standardized framework for describing food textures 
            and drink thickness for individuals with dysphagia. Levels 0-4 describe drinks; Levels 3-7 
            describe foods. Levels 3-4 are transitional (can be both).
          </p>
        </div>

        {/* Visual Framework Triangle */}
        <div className="p-6 bg-muted/30 rounded-lg">
          <h3 className="font-semibold text-lg mb-4 text-center">IDDSI Framework Overview</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Drinks Column */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Drinks (0-4)</h4>
              </div>
              {drinkLevels.map((level) => (
                <button
                  key={`drink-${level.level}`}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${level.bgClass} ${level.borderClass} ${
                    selectedLevel?.level === level.level ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Level {level.level}</span>
                    <span className="text-sm font-medium">{level.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Foods Column */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <UtensilsCrossed className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Foods (3-7)</h4>
              </div>
              {foodLevels.map((level) => (
                <button
                  key={`food-${level.level}`}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${level.bgClass} ${level.borderClass} ${
                    selectedLevel?.level === level.level ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Level {level.level}</span>
                    <span className="text-sm font-medium">{level.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Level Detail */}
        {selectedLevel && (
          <div className={`p-6 rounded-lg border-2 ${selectedLevel.borderClass} ${selectedLevel.bgClass}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Level {selectedLevel.level}: {selectedLevel.name}</h3>
                <span className="px-3 py-1 rounded-full bg-white/50 text-sm font-medium capitalize">
                  {selectedLevel.type}
                </span>
              </div>
              <p className="text-lg">{selectedLevel.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Characteristics</h4>
                  <ul className="text-sm space-y-1">
                    {selectedLevel.characteristics.map((char, i) => (
                      <li key={i}>• {char}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Examples</h4>
                  <ul className="text-sm space-y-1">
                    {selectedLevel.examples.map((ex, i) => (
                      <li key={i}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white/50 rounded-lg flex items-start gap-3">
                <TestTube className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Testing Method</h4>
                  <p className="text-sm mt-1">{selectedLevel.testingMethod}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="testing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testing">Testing Methods</TabsTrigger>
            <TabsTrigger value="safety">Safety Notes</TabsTrigger>
            <TabsTrigger value="tips">Clinical Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testing" className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                IDDSI Flow Test (for Drinks)
              </h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Use a 10ml slip-tip syringe (no needle)</li>
                <li>Fill to 10ml mark, hold vertically</li>
                <li>Allow liquid to flow for exactly 10 seconds</li>
                <li>Measure remaining liquid to determine level</li>
              </ol>
              <div className="mt-3 text-sm bg-white/50 p-2 rounded">
                <strong>Results:</strong> 0ml = Level 0 | 1-4ml = Level 1 | 4-8ml = Level 2 | 8+ml = Level 3
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Fork Tests (for Foods)</h4>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className="p-3 bg-white/50 rounded">
                  <strong>Fork Drip Test:</strong> Press fork flat on sample, lift. Level 3 drips slowly; Level 4+ sits on fork
                </div>
                <div className="p-3 bg-white/50 rounded">
                  <strong>Fork Pressure Test:</strong> Apply thumb pressure through fork. Level 5-6 foods should mash easily
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="safety" className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important Safety Considerations</p>
                <ul className="mt-2 space-y-1">
                  <li>• Always follow SLP/dietitian recommendations for individual patients</li>
                  <li>• Test foods/drinks before serving to ensure correct texture</li>
                  <li>• Particle size matters: Adult = 4mm (Level 5), 15mm (Level 6)</li>
                  <li>• Pediatric sizes are smaller: 2mm (Level 5), 8mm (Level 6)</li>
                  <li>• Avoid mixed consistencies unless specifically prescribed</li>
                  <li>• Re-assess texture if food cools or sits (may change consistency)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Implementation Tips</p>
                <ul className="mt-2 space-y-1">
                  <li>• Document IDDSI levels in patient diet orders (e.g., "IDDSI Level 5 foods, Level 2 drinks")</li>
                  <li>• Use standardized language across disciplines</li>
                  <li>• Train kitchen/dietary staff on IDDSI testing methods</li>
                  <li>• Post IDDSI reference charts in patient meal prep areas</li>
                  <li>• Consider both food AND drink levels - they're prescribed separately</li>
                  <li>• Level 3 & 4 are "transitional" - can be food OR drink depending on how served</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-muted-foreground">
          <p>Reference: <strong>iddsi.org</strong> - International Dysphagia Diet Standardisation Initiative</p>
          <p className="mt-1">IDDSI Framework released 2016, updated 2019. Free to use globally.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IDDSIReferenceChart;
