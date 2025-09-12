import { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface UploadedImage {
  file: File;
  preview: string;
}

export default function AIVisualizationPage() {
  const [step, setStep] = useState<'upload' | 'configure' | 'generating' | 'result'>('upload');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectTypes = [
    { id: 'piscine', name: 'Piscine & Spa', icon: '🏊‍♂️', description: 'Piscines creusées, hors-sol, spas' },
    { id: 'paysage', name: 'Aménagement Paysager', icon: '🌳', description: 'Jardins, terrasses, allées' },
    { id: 'menuiserie', name: 'Menuiserie Extérieure', icon: '🔨', description: 'Pergolas, clôtures, abris' },
    { id: 'terrasse', name: 'Terrasse & Patio', icon: '🏡', description: 'Terrasses bois, pierre, composite' }
  ];

  const styles = [
    { id: 'moderne', name: 'Moderne', description: 'Lignes épurées, matériaux contemporains' },
    { id: 'traditionnel', name: 'Traditionnel', description: 'Style classique, matériaux naturels' },
    { id: 'tropical', name: 'Tropical', description: 'Végétation luxuriante, ambiance exotique' },
    { id: 'mediterraneen', name: 'Méditerranéen', description: 'Pierre, olivier, couleurs chaudes' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file,
          preview: e.target?.result as string
        });
        setStep('configure');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVisualization = () => {
    setStep('generating');
    setProgress(0);
    
    // Simulate AI generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('result');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const resetProcess = () => {
    setStep('upload');
    setUploadedImage(null);
    setSelectedProjectType('');
    setSelectedStyle('');
    setProgress(0);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Visualisation IA
                </h1>
                <p className="text-sm text-muted-foreground">Générez des rendus professionnels de vos projets</p>
              </div>
            </div>
            
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <Badge variant={step === 'upload' ? 'default' : 'secondary'}>1. Upload</Badge>
              <Badge variant={step === 'configure' ? 'default' : 'secondary'}>2. Configuration</Badge>
              <Badge variant={step === 'generating' ? 'default' : 'secondary'}>3. Génération</Badge>
              <Badge variant={step === 'result' ? 'default' : 'secondary'}>4. Résultat</Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="hover-elevate">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-600/20 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <CardTitle>Uploadez votre photo de terrain</CardTitle>
                  <p className="text-muted-foreground">
                    Sélectionnez une photo claire de l'espace à aménager pour obtenir le meilleur rendu
                  </p>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="upload-zone"
                  >
                    <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-lg font-medium mb-2">Cliquez pour sélectionner une photo</p>
                    <p className="text-sm text-muted-foreground">
                      Formats supportés: JPG, PNG, WEBP • Max 10MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="file-input"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && uploadedImage && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle>Image téléchargée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={uploadedImage.preview}
                      alt="Terrain à aménager"
                      className="w-full h-64 object-cover rounded-lg"
                      data-testid="uploaded-image-preview"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-change-image"
                    >
                      Changer d'image
                    </Button>
                  </CardContent>
                </Card>

                {/* Configuration */}
                <div className="space-y-6">
                  {/* Project Type */}
                  <Card className="hover-elevate">
                    <CardHeader>
                      <CardTitle>Type de projet</CardTitle>
                      <p className="text-sm text-muted-foreground">Sélectionnez le type d'aménagement souhaité</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                      {projectTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedProjectType === type.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedProjectType(type.id)}
                          data-testid={`project-type-${type.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <h4 className="font-medium">{type.name}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Style */}
                  {selectedProjectType && (
                    <Card className="hover-elevate">
                      <CardHeader>
                        <CardTitle>Style de rendu</CardTitle>
                        <p className="text-sm text-muted-foreground">Choisissez l'ambiance désirée</p>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-3">
                        {styles.map((style) => (
                          <div
                            key={style.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedStyle === style.id 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setSelectedStyle(style.id)}
                            data-testid={`style-${style.id}`}
                          >
                            <h4 className="font-medium">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {selectedProjectType && selectedStyle && (
                    <Button 
                      className="w-full" 
                      onClick={generateVisualization}
                      data-testid="button-generate"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer la visualisation
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 'generating' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="hover-elevate text-center">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                  <CardTitle>Génération en cours...</CardTitle>
                  <p className="text-muted-foreground">
                    Notre IA analyse votre terrain et génère le rendu professionnel
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progress} className="w-full" data-testid="generation-progress" />
                  <p className="text-sm text-muted-foreground">
                    {progress < 30 && "Analyse de l'image..."}
                    {progress >= 30 && progress < 60 && "Application du style..."}
                    {progress >= 60 && progress < 90 && "Génération du rendu..."}
                    {progress >= 90 && "Finalisation..."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && uploadedImage && (
            <div className="max-w-6xl mx-auto space-y-6">
              <Card className="hover-elevate">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <CardTitle>Visualisation générée avec succès !</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid="button-download">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetProcess} data-testid="button-new-render">
                      Nouveau rendu
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Avant</h3>
                      <img
                        src={uploadedImage.preview}
                        alt="Terrain original"
                        className="w-full h-80 object-cover rounded-lg border"
                        data-testid="before-image"
                      />
                      <Badge variant="outline">Image originale</Badge>
                    </div>

                    {/* After */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Après - Rendu IA</h3>
                      <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Sparkles className="h-12 w-12 mx-auto text-purple-500" />
                          <p className="text-lg font-medium">Rendu IA généré</p>
                          <p className="text-sm text-muted-foreground">
                            Ici apparaîtrait le rendu professionnel<br />
                            avec votre {selectedProjectType} en style {selectedStyle}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                        Généré par IA
                      </Badge>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Détails du projet</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type de projet:</span>
                        <span className="ml-2 font-medium">{projectTypes.find(p => p.id === selectedProjectType)?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Style appliqué:</span>
                        <span className="ml-2 font-medium">{styles.find(s => s.id === selectedStyle)?.name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hidden file input for step 2 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </main>
      </div>
    </div>
  );
}